import React from 'react';
import { createClient } from "next-sanity";
import { PortableText } from '@portabletext/react';
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// CACHE KILLER
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function SingleBlogPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "imageUrl": mainImage.asset->url,
    publishedAt,
    body,
    "authorName": author->name,
    "authorImage": author->image.asset->url,
    "categories": categories[]->title
  }`;

  const post = await client.fetch(query, { slug: slug });

  if (!post) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center text-white flex-col pt-32">
        <h1 className="text-4xl font-bold mb-4">Blog Not Found!</h1>
        <Link href="/blog" className="text-[#3AE272] font-bold underline">Go back to all articles</Link>
      </div>
    );
  }

  const components = {
    block: {
      h1: ({children}) => <h1 className="text-3xl md:text-5xl font-extrabold mt-16 mb-8 text-white leading-tight tracking-tight">{children}</h1>,
      h2: ({children}) => <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-white tracking-wide">{children}</h2>,
      h3: ({children}) => <h3 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-[#3AE272]">{children}</h3>,
      normal: ({children}) => <p className="text-slate-300 text-[17px] md:text-lg leading-relaxed mb-8 font-medium">{children}</p>,
    }
  };

  return (
    <div className="bg-[#020408] min-h-screen pt-28 pb-20 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      <div className="max-w-[850px] mx-auto px-6 md:px-8 relative z-10 mb-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#3AE272] transition-colors uppercase tracking-wider w-max group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to insights
        </Link>
      </div>

      {post.imageUrl && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16 relative z-10">
           <div className="relative rounded-[2rem] overflow-hidden border border-white/10 group">
             <img src={post.imageUrl} alt={post.title} className="w-full h-[300px] md:h-[500px] object-cover relative z-10 group-hover:scale-[1.02] transition-transform duration-1000" />
           </div>
        </div>
      )}

      <div className="max-w-[850px] mx-auto px-6 md:px-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10 text-white leading-[1.1]">
          {post.title}
        </h1>
        
        {/* Social Share (Error Fixed with SVG) */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-slate-400 text-sm font-medium mr-2">Share:</span>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </button>
        </div>

        <div className="prose-container">
          <PortableText value={post.body} components={components} />
        </div>
      </div>
    </div>
  );
}