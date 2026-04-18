import React from 'react';
import { createClient } from "next-sanity";
import { PortableText } from '@portabletext/react';
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, LayoutGrid, Calendar, Target } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Sanity connection
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function CaseStudyDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const query = `*[_type == "caseStudies" && slug.current == $slug][0]{
    title,
    client,
    "imageUrl": coverImage.asset->url,
    category,
    highlightStat,
    highlightLabel,
    summary,
    _createdAt,
    content[]{
      ...,
      _type == "image" => {
        ...,
        asset->{url}
      }
    }
  }`;

  const study = await client.fetch(query, { slug: slug }, { cache: 'no-store' });

  if (!study) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center text-white flex-col pt-32">
        <h1 className="text-5xl font-black mb-4">404 - Not Found!</h1>
        <Link href="/case-studies" className="text-[#3AE272] font-bold hover:underline flex items-center gap-2 mt-4">
          <ArrowLeft size={18} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  // 🚀 PRO LOGIC: Sanity content se Images aur Text ko alag-alag filter kar liya
  const contentImages = study.content?.filter(item => item._type === 'image') || [];
  const contentText = study.content?.filter(item => item._type !== 'image') || [];

  // Portable Text (Right Side Text) Formatting (Exact WeBeeSocial Style Lists)
  const components = {
    block: {
      h1: ({children}) => <h1 className="text-3xl md:text-4xl font-black mt-12 mb-6 text-white tracking-tight">{children}</h1>,
      h2: ({children}) => <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-white">{children}</h2>,
      h3: ({children}) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[#3AE272]">{children}</h3>,
      normal: ({children}) => <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 font-medium">{children}</p>,
    },
    list: {
      bullet: ({children}) => (
        <ul className="mb-8 space-y-4">
          {children}
        </ul>
      ),
      number: ({children}) => <ol className="list-decimal list-outside ml-5 text-slate-300 text-lg mb-8 space-y-3 font-bold">{children}</ol>,
    },
    listItem: {
      bullet: ({children}) => (
        <li className="flex items-start gap-3 text-slate-300 text-base md:text-lg font-medium leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-[#3AE272] shrink-0 mt-1 shadow-[0_0_10px_rgba(58,226,114,0.3)] rounded-full" />
          <span>{children}</span>
        </li>
      )
    },
    marks: {
      strong: ({children}) => <strong className="font-extrabold text-white">{children}</strong>,
    }
  };

  return (
    <div className="bg-[#020408] min-h-screen text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#3AE272]/30 selection:text-white relative overflow-hidden">
      
      <CustomCursor />
      
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-[#3AE272]/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-6 py-32 relative z-10">
        
        {/* --- TOP BACK BUTTON --- */}
        <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#3AE272] transition-colors uppercase tracking-wider mb-12 w-max group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Work
        </Link>

        {/* --- SPLIT SCREEN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* =========================================
              LEFT COLUMN: VISUALS (Images Grid)
          ========================================= */}
          <div className="lg:col-span-7 space-y-6 md:space-y-10 order-2 lg:order-1">
            
            {/* 1. Cover Image (Always Top) */}
            {study.imageUrl && (
              <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0b1015]">
                <img src={study.imageUrl} alt={study.title} className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700" />
              </div>
            )}

            {/* 2. Content Images (Generated from Sanity Rich Text) */}
            {contentImages.map((imgBlock, i) => {
              if (!imgBlock?.asset?.url) return null;
              return (
                <div key={i} className="rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0b1015]">
                  <img src={imgBlock.asset.url} alt={`Campaign Visual ${i+1}`} className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700" />
                </div>
              );
            })}

            {/* Empty State for Media */}
            {!study.imageUrl && contentImages.length === 0 && (
               <div className="aspect-[4/3] rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center font-black text-slate-700 text-4xl">VISUALS PENDING</div>
            )}
          </div>

          {/* =========================================
              RIGHT COLUMN: TEXT (Sticky Content)
          ========================================= */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-32">
            
            {/* Title & Client */}
            <div className="mb-10 pb-10 border-b border-white/10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-[1.1] tracking-tight">
                {study.title}
              </h1>
              {study.client && (
                <p className="text-xl text-[#3AE272] font-bold">Client: {study.client}</p>
              )}
            </div>

            {/* Portable Text Content (Objectives, What We Did, Results) */}
            {contentText.length > 0 ? (
              <div className="prose-container mb-12">
                <PortableText value={contentText} components={components} />
              </div>
            ) : (
              <div className="mb-12">
                <p className="text-slate-400 text-lg">Detailed case study content is being updated.</p>
              </div>
            )}

            {/* Info Box (Category, Date) */}
            <div className="bg-[#0b1015]/80 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[1.5rem] mt-10">
              <h4 className="text-white font-bold text-xl mb-6">Info</h4>
              <div className="space-y-4">
                <div className="flex gap-4 border-b border-white/5 pb-4">
                  <span className="text-slate-500 font-medium w-24 shrink-0 flex items-center gap-2"><Calendar size={16}/> Date</span>
                  <span className="text-slate-200 font-semibold text-right w-full">
                    {new Date(study._createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-500 font-medium w-24 shrink-0 flex items-center gap-2"><LayoutGrid size={16}/> Category</span>
                  <span className="text-slate-200 font-semibold text-right w-full">{study.category || 'Digital Campaign'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* --- RELATED PROJECTS CTA (Bottom Section) --- */}
      <div className="border-t border-white/10 bg-[#05080c] py-24 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-10">Ready to build your <span className="text-[#3AE272]">Success Story?</span></h2>
          <Link href="/contact" className="inline-flex items-center justify-center gap-3 bg-[#3AE272] text-[#022c22] font-black py-5 px-12 rounded-full hover:bg-[#4df287] transition-all shadow-[0_0_40px_rgba(58,226,114,0.3)] hover:-translate-y-1 hover:scale-105 text-lg uppercase tracking-wider">
            Start Your Campaign <ChevronRight size={24} />
          </Link>
        </div>
      </div>

    </div>
  );
}