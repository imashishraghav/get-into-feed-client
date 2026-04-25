import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User, Zap } from "lucide-react";

export default function FeaturedBlogHero({ post }) {
  if (!post) return null;

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "Recently Published";

  const estimatedReadTime = post.readTime || Math.max(1, Math.ceil((post.excerpt?.length || 0) / 100));

  const trendingTags = post.tags?.length > 0 
    ? post.tags 
    : ["#RealEstate", "#HomeLoans", "#SmartHomes", "#MarketTrends"];

  return (
    <section className="relative w-full flex flex-col selection:bg-[#2ED1B2]/30 selection:text-white mt-24 lg:mt-28">
      
      {/* 1. FULL-WIDTH HERO IMAGE & OVERLAY */}
      <div className="relative w-full min-h-[70vh] flex flex-col justify-center overflow-hidden group py-14 lg:py-16">
        
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-[20s] ease-out group-hover:scale-110 transform-gpu"
          />
        ) : (
          <div className="absolute inset-0 bg-[#0F172A]" />
        )}

        {/* Premium Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-50 z-10 pointer-events-none" />

        {/* 2. LEFT ALIGNED CONTENT BLOCK */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
          
          <div className="max-w-3xl flex flex-col items-start gap-6">
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2ED1B2] text-[#0F172A] rounded-md font-extrabold text-[10px] uppercase tracking-widest shadow-lg">
              <Zap className="w-3 h-3 fill-[#0F172A]" />
              Featured Story
            </div>

            {/* 🟢 THE FIX: 'leading-[1.3]' ko '!leading-[1.4]' kar diya hai. 
                '!' lagane se yeh force karega ki lines ke beech minimum 1.4x ka gap rahe hi rahe! */}
            <h1 className="text-3xl md:text-4xl lg:text-[3.25rem] font-extrabold text-white !leading-[1.2] tracking-tight max-w-4xl drop-shadow-md">
              {post.title}
            </h1>

            <p className="text-base md:text-lg text-slate-300 !leading-[1.4] line-clamp-3 max-w-2xl font-medium">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#2ED1B2]" />
                <span className="text-white">{post.author?.name || "Ashish Raghav"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#2ED1B2]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#2ED1B2]" />
                <span>{estimatedReadTime} min read</span>
              </div>
            </div>

            <div className="mt-2">
              <Link href={`/blog/${post.slug}`}>
                <button className="bg-white text-[#0F172A] hover:bg-[#2ED1B2] hover:text-[#0F172A] px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(46,209,178,0.3)] transform hover:-translate-y-1">
                  Read Full Article
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* 3. TRENDING TAGS BOTTOM BAR */}
      <div className="relative w-full bg-[#0F172A] border-t border-white/10 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED1B2] animate-pulse" />
            <span className="text-[#2ED1B2] text-[11px] font-bold uppercase tracking-[0.2em]">Trending</span>
          </div>
          <div className="w-px h-5 bg-white/20 shrink-0 hidden md:block" />
          <div className="flex items-center gap-2.5">
            {trendingTags.map((tag, i) => (
              <span key={i} className="shrink-0 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium cursor-default hover:bg-white/10 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}