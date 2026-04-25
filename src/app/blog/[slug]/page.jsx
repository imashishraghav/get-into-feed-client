import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';

// 🟢 Components Imports
import { portableTextComponents } from '@/components/blog/PortableTextConfig';
import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareSidebar from '@/components/blog/ShareSidebar';
import TableOfContents from '@/components/blog/TableOfContents';
import CommentSection from '@/components/blog/CommentSection'; // 🟢 Added Comment Section Import

// ==========================================
// ⚡ ISR: REAL-TIME UPDATE SYSTEM (60s)
// ==========================================
export const revalidate = 60;

// ==========================================
// 1. STATIC GENERATION (SSG)
// ==========================================
export async function generateStaticParams() {
  const query = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;
  const slugs = await client.fetch(query).catch(() => []); 
  return slugs.map((post) => ({ slug: post.slug }));
}

// ==========================================
// 2. DYNAMIC SEO METADATA
// ==========================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    excerpt,
    "image": mainImage.asset->url
  }`;
  
  const post = await client.fetch(query, { slug: resolvedParams.slug }).catch(() => null);

  if (!post) return {};

  return {
    title: `${post.title} | Get Into Feed`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

// ==========================================
// 3. HELPER: EXTRACT HEADINGS FOR TOC
// ==========================================
function extractHeadings(blocks) {
  if (!blocks || !Array.isArray(blocks)) return [];
  
  const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  
  return blocks
    .filter((b) => b._type === "block" && ["h2", "h3"].includes(b.style))
    .map((b) => {
      const text = b.children?.map((c) => c.text || '').join("") || "";
      return {
        id: slugify(text),
        text: text,
        level: b.style,
      };
    });
}

// ==========================================
// 4. MAIN SERVER COMPONENT
// ==========================================
export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;

  // 🟢 FIX: Added _id and comments subquery
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    excerpt,
    "image": mainImage.asset->url,
    publishedAt,
    readTime,
    "category": categories[0]->title, 
    body,
    "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt desc)
  }`;

  const post = await client.fetch(query, { slug: resolvedParams.slug }).catch(() => null); 

  if (!post) notFound();

  // Extract Headings for TOC
  const headings = extractHeadings(post.body || []);

  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently Published';

  return (
    <main className="bg-[#F8F9FB] min-h-screen relative font-sans text-[#0F172A] selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      <ReadingProgress />

      {/* --- HERO SECTION --- */}
      <header className="max-w-4xl mx-auto pt-32 px-6 text-center mb-16 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-[#2ED1B2] font-bold tracking-widest uppercase text-xs border border-[#E5E7EB] bg-white px-4 py-1.5 rounded-full shadow-sm">
            {post.category || 'Insights'}
          </span>
          <span className="text-[#475569] text-sm font-medium">
            {formattedDate} • {post.readTime || '5'} min read
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#0F172A] leading-tight mb-8 tracking-tight text-balance">
          {post.title}
        </h1>
        
        <p className="text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed text-balance">
          {post.excerpt}
        </p>
      </header>

      {/* --- FEATURED IMAGE --- */}
      {post.image && (
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB] bg-white">
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

      {/* --- CONTENT LAYOUT (Sticky Sidebar + Article) --- */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_150px] gap-12 pb-32">
        
        {/* LEFT SIDEBAR (TOC + Share) */}
        <aside className="hidden lg:block relative">
          <div className="sticky top-32 flex flex-col gap-12">
            
            {headings.length > 0 && <TableOfContents headings={headings} />}

            <div>
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.2em] mb-4 text-center">
                Share Article
              </p>
              <ShareSidebar title={post.title} slug={resolvedParams.slug} />
            </div>

          </div>
        </aside>

        {/* --- MAIN ARTICLE & COMMENTS WRAPPER --- */}
        {/* 🟢 Wrapped article and comments together so they stay in the middle column */}
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-16">
          <article className="w-full leading-relaxed prose prose-lg prose-slate prose-a:text-[#2ED1B2] hover:prose-a:text-[#0EA5A4] prose-headings:text-[#0F172A]">
            {post.body && (
              <PortableText value={post.body} components={portableTextComponents} />
            )}
          </article>

          {/* 🟢 Integrated Comment Section */}
          <CommentSection postId={post._id} initialComments={post.comments || []} />
        </div>

        {/* Empty right sidebar for centered focus */}
        <div className="hidden lg:block"></div>
      </div>
    </main>
  );
}