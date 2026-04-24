import { notFound } from 'next/navigation';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portable-text-config';
import ReadingProgress from '@/components/reading-progress';
import BlogSidebar from '@/components/blog-sidebar';

// 🚀 ISR: Auto-update page every 60 seconds when new content is published
export const revalidate = 60;

// ==========================================
// 1. DYNAMIC SEO METADATA
// ==========================================
export async function generateMetadata({ params }) {
  const query = `*[_type == "post" && slug.current == $slug][0]{ title, excerpt, "image": mainImage.asset->url }`;
  const post = await client.fetch(query, { slug: params.slug });

  if (!post) return {};

  return {
    title: `${post.title} | Get Into Feed`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

// ==========================================
// 2. HELPER: CALCULATE READ TIME
// ==========================================
function calculateReadTime(blocks) {
  if (!blocks) return '1 min';
  const text = blocks.map(block => block.children?.map(child => child.text).join('')).join(' ');
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return `${time} min read`;
}

// ==========================================
// 3. MAIN SERVER COMPONENT
// ==========================================
export default async function BlogPost({ params }) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    excerpt,
    "image": mainImage.asset->url,
    publishedAt,
    "category": categories[0]->title,
    "author": author->name,
    body,
    relatedPosts[]->{ title, "slug": slug.current }
  }`;
  
  const post = await client.fetch(query, { slug: params.slug });

  if (!post) notFound();

  const readTime = calculateReadTime(post.body);

  return (
    <main className="bg-[#0F172A] min-h-screen relative font-sans text-white selection:bg-[#2ED1B2]/30 selection:text-white">
      {/* 🟢 ADVANCED: Top Reading Progress Bar */}
      <ReadingProgress />

      {/* --- HERO SECTION --- */}
      <header className="max-w-4xl mx-auto pt-32 px-6 text-center mb-16 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-[#2ED1B2] font-semibold tracking-widest uppercase text-xs border border-[#2ED1B2]/30 bg-[#2ED1B2]/10 px-4 py-1.5 rounded-full">
            {post.category || 'Performance Marketing'}
          </span>
          <span className="text-[#94A3B8] text-sm">•</span>
          <span className="text-[#94A3B8] text-sm font-medium flex items-center gap-1.5">
             ⏱️ {readTime}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8">
          {post.title}
        </h1>
        <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* --- FEATURED IMAGE --- */}
      {post.image && (
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(46,209,178,0.15)] ring-1 ring-white/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>
        </div>
      )}

      {/* --- HUBSPOT STYLE LAYOUT (Sidebar + Content) --- */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_150px] gap-12 pb-32">
        
        {/* LEFT: STICKY SIDEBAR (TOC + SHARE) */}
        <aside className="hidden lg:block relative">
          <div className="sticky top-32">
            <BlogSidebar title={post.title} slug={params.slug} body={post.body} />
          </div>
        </aside>

        {/* CENTER: MAIN CONTENT (PORTABLE TEXT) */}
        <article className="prose prose-lg prose-invert max-w-none 
          prose-headings:text-white prose-p:text-[#94A3B8] prose-p:leading-loose 
          prose-a:text-[#2ED1B2] hover:prose-a:text-white prose-a:transition-colors
          prose-strong:text-white prose-li:text-[#94A3B8] prose-li:marker:text-[#2ED1B2]">
          <PortableText value={post.body} components={portableTextComponents} />
        </article>

        {/* RIGHT: EMPTY/ADS SPACE (HubSpot keeps right side empty for focus) */}
        <div className="hidden lg:block"></div>
      </div>
    </main>
  );
}