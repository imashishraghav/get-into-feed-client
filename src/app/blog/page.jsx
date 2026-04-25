import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, Clock } from "lucide-react";

// 🟢 FIX: Changed the import path to match your existing file name (FeaturedBlog)
import FeaturedBlogHero from "@/components/blog/FeaturedBlog";

// ==========================================
// ⚡ ISR: AUTO-UPDATE EVERY 60 SECONDS
// ==========================================
export const revalidate = 60;

export const metadata = {
  title: "Editorial Blog & Insights | Get Into Feed",
  description: "Premium insights, market trends, and growth strategies.",
};

// ==========================================
// 🔌 DATA FETCHING (Parallel for Speed)
// ==========================================
async function getBlogData() {
  const featuredQuery = `*[_type == "post"] | order(publishedAt desc)[0]{
    title, excerpt, "slug": slug.current, "image": mainImage.asset->url,
    publishedAt, readTime, "category": categories[0]->title, author->{name}, tags[]
  }`;

  const latestQuery = `*[_type == "post"] | order(publishedAt desc)[1...11]{
    _id, title, excerpt, "slug": slug.current, "image": mainImage.asset->url,
    publishedAt, readTime, "category": categories[0]->title
  }`;

  const categoryQuery = `*[_type == "category"]{
    title, "count": count(*[_type == "post" && references(^._id)])
  }`;

  // Execute all queries at once
  const [featuredPost, latestPosts, categories] = await Promise.all([
    client.fetch(featuredQuery).catch(() => null),
    client.fetch(latestQuery).catch(() => []),
    client.fetch(categoryQuery).catch(() => []),
  ]);

  return { featuredPost, latestPosts, categories };
}

// ==========================================
// 🎨 MAIN PAGE LAYOUT
// ==========================================
export default async function BlogPage() {
  const { featuredPost, latestPosts, categories } = await getBlogData();

  const firstLatestPost = latestPosts[0];
  const remainingPosts = latestPosts.slice(1);

  return (
    <main className="min-h-screen bg-[#F8F9FB] selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      {/* 🚀 1. FULL WIDTH HERO */}
      <FeaturedBlogHero post={featuredPost} />

      {/* 🧱 2. MAIN LAYOUT (2-COLUMN GRID) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
          
          {/* ================= LEFT SIDE: MAIN CONTENT ================= */}
          <div className="flex flex-col gap-12">
            
            <div className="border-b border-[#E5E7EB] pb-4 mb-2">
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Latest Articles
              </h2>
            </div>

            {/* A. Full Width Card (1st Latest Post) */}
            {firstLatestPost && (
              <BlogCard post={firstLatestPost} isFullWidth={true} />
            )}

            {/* B. Grid Cards (Remaining Posts) */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {remainingPosts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT SIDE: STICKY SIDEBAR ================= */}
          <aside className="w-full">
            <div className="sticky top-32 flex flex-col gap-10">
              
              {/* 1. Search Bar */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#2ED1B2]" /> Search Articles
                </h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search topics, guides..." 
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0F172A] rounded-xl px-4 py-3 pl-4 pr-12 focus:outline-none focus:border-[#2ED1B2] focus:ring-1 focus:ring-[#2ED1B2] transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2ED1B2] hover:bg-[#0EA5A4] p-2 rounded-lg transition-colors">
                    <Search className="w-4 h-4 text-[#0F172A]" />
                  </button>
                </div>
              </div>

              {/* 2. Categories */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold text-[#0F172A] mb-5 border-b border-[#E5E7EB] pb-3">
                  Categories
                </h3>
                <ul className="flex flex-col gap-3">
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <Link href="#" className="group flex items-center justify-between py-2 text-[#475569] hover:text-[#0EA5A4] transition-colors">
                        <span className="flex items-center gap-2 font-medium">
                          <ChevronRight className="w-4 h-4 text-[#2ED1B2] opacity-0 group-hover:opacity-100 transition-opacity" />
                          {cat.title}
                        </span>
                        <span className="bg-[#F8F9FB] text-[#0EA5A4] text-xs font-bold px-2.5 py-1 rounded-md border border-[#E5E7EB]">
                          {cat.count || 0}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Recent Posts Widget */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold text-[#0F172A] mb-5 border-b border-[#E5E7EB] pb-3">
                  Recent Posts
                </h3>
                <div className="flex flex-col gap-5">
                  {latestPosts.slice(0, 4).map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug}`} className="group flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB]">
                        {post.image && (
                          <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#0EA5A4] text-[10px] font-bold uppercase tracking-wider mb-1">
                          {post.category || 'Updates'}
                        </span>
                        <h4 className="text-[#0F172A] text-sm font-bold leading-tight group-hover:text-[#2ED1B2] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

// ==========================================
// 🧱 REUSABLE BLOG CARD COMPONENT
// ==========================================
function BlogCard({ post, isFullWidth = false }) {
  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently";

  const estimatedReadTime = post.readTime || Math.max(1, Math.ceil((post.excerpt?.length || 0) / 100));

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full focus:outline-none">
      <div className={`bg-white border border-[#E5E7EB] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#2ED1B2]/40 transition-all duration-500 transform-gpu hover:-translate-y-1 flex ${isFullWidth ? 'flex-col md:flex-row' : 'flex-col'} h-full`}>
        
        {/* Image Container */}
        <div className={`relative w-full overflow-hidden bg-slate-100 ${isFullWidth ? 'md:w-1/2 aspect-video md:aspect-auto' : 'aspect-[16/10]'}`}>
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Content Container */}
        <div className={`p-6 md:p-8 flex flex-col flex-1 ${isFullWidth ? 'md:w-1/2 justify-center' : ''}`}>
          
          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider">
            <span className="text-white bg-[#0EA5A4] px-2.5 py-1 rounded-md shadow-sm">
              {post.category || "General"}
            </span>
            <span className="text-[#94A3B8]">•</span>
            <span className="text-[#475569]">{formattedDate}</span>
          </div>
          
          <h3 className={`${isFullWidth ? 'text-2xl md:text-3xl' : 'text-xl'} font-extrabold text-[#0F172A] mb-3 group-hover:text-[#0EA5A4] transition-colors leading-tight line-clamp-2`}>
            {post.title}
          </h3>
          
          <p className="text-[#475569] mb-6 line-clamp-2 text-sm leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-5 border-t border-[#E5E7EB] flex items-center justify-between text-sm font-bold text-[#0F172A] group-hover:text-[#0EA5A4] transition-colors duration-300">
            <span className="flex items-center gap-1">
              Read Article <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#2ED1B2]" />
            </span>
            <span className="flex items-center text-[#475569]">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[#2ED1B2]" />
              {estimatedReadTime} min
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}