import React from 'react';
import { createClient } from "next-sanity";
import { PortableText } from '@portabletext/react';
import Link from "next/link";
import { 
  ArrowLeft, Sparkles, Target, Compass, Puzzle, 
  Map, CheckCircle2, ChevronDown, PlayCircle, TrendingUp, Award
} from "lucide-react";

// 🚀 CACHE KILLER
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Sanity connection
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function SingleServiceDetailPremiumPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const query = `*[_type == "service" && slug.current == $slug][0]{
    title,
    "iconUrl": icon.asset->url,
    shortDescription,
    content
  }`;

  const service = await client.fetch(query, { slug: slug });

  if (!service) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center text-white flex-col pt-32">
        <h1 className="text-4xl font-bold mb-4">Service Not Found!</h1>
        <Link href="/services" className="text-[#3AE272] font-bold underline">Go back to Services</Link>
      </div>
    );
  }

  // Portable Text (Body) Styling
  const components = {
    block: {
      h1: ({children}) => <h1 className="text-3xl md:text-5xl font-extrabold mt-12 mb-6 text-white tracking-tight">{children}</h1>,
      h2: ({children}) => <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-white">{children}</h2>,
      h3: ({children}) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[#3AE272]">{children}</h3>,
      normal: ({children}) => <p className="text-slate-300 text-[17px] md:text-lg leading-relaxed mb-6 font-medium">{children}</p>,
    },
    list: {
      bullet: ({children}) => <ul className="list-disc list-outside ml-5 text-slate-300 text-lg mb-6 space-y-3 marker:text-[#3AE272]">{children}</ul>,
    }
  };

  return (
    <div className="bg-[#020408] min-h-screen pt-28 pb-20 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#3AE272]/30 selection:text-white relative overflow-hidden">
      
      {/* Global Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-gradient-to-b from-[#3AE272]/[0.05] to-transparent rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* --- BACK BUTTON --- */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10 mb-12">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#3AE272] transition-colors uppercase tracking-wider w-max group bg-white/5 px-5 py-2.5 rounded-full border border-white/5 hover:border-[#3AE272]/30">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Services
        </Link>
      </div>

      {/* ==========================================
          1. HERO SECTION (Dynamic from Sanity)
      ========================================== */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10 mb-24">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3AE272]/10 border border-[#3AE272]/20 mb-6">
              <Sparkles size={16} className="text-[#3AE272]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#3AE272]">Premium Service</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-white leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{service.title}</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {service.shortDescription}
            </p>
          </div>

          {/* Right: Floating Icon/Visual */}
          <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative">
            <div className="absolute inset-0 bg-[#3AE272]/20 blur-[50px] rounded-full animate-pulse"></div>
            <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-[#131b24] to-[#0a0f14] border border-white/10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 transform lg:rotate-3 hover:rotate-0 transition-transform duration-500">
              {service.iconUrl ? (
                <img src={service.iconUrl} alt={service.title} className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(58,226,114,0.4)]" />
              ) : (
                <Target size={80} className="text-[#3AE272] drop-shadow-[0_0_20px_rgba(58,226,114,0.4)]" strokeWidth={1} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. PORTABLE TEXT CONTENT (If any in Sanity)
      ========================================== */}
      {service.content && (
        <div className="max-w-[900px] mx-auto px-6 md:px-8 relative z-10 mb-32">
          <div className="prose-container bg-[#0b1015]/40 backdrop-blur-sm border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-xl">
            <PortableText value={service.content} components={components} />
          </div>
        </div>
      )}

      {/* ==========================================
          3. OUR HOLISTIC APPROACH (Step-by-Step)
      ========================================== */}
      <section className="py-24 relative border-t border-b border-white/5 bg-[#05080c]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Our <span className="text-[#3AE272]">Holistic</span> Approach</h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
              Let’s guide you through our simple yet effective process, step by step!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
            {/* Background Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#3AE272]/30 to-transparent -translate-y-1/2 z-0"></div>

            {[
              { icon: <Compass size={32}/>, title: "Getting to Know Your Brand", desc: "First, we dive deep into your brand’s story, immersing ourselves in your vision, mission, and objectives. Think of it as a treasure hunt for insights that matter!" },
              { icon: <Map size={32}/>, title: "Laying Down the Strategy", desc: "Next, our strategy unfolds like a well-planned adventure. We create a clear, time-bound roadmap that breaks your goals into specific, measurable KPIs." },
              { icon: <Puzzle size={32}/>, title: "Creating the Right Mix", desc: "Then, we craft the perfect mix of audiences, platforms, and content. Whether it’s a bold campaign or a quirky niche idea, we seamlessly weave your narrative." },
              { icon: <Target size={32}/>, title: "Outlining the Game Plan", desc: "We also provide a detailed scope of work that outlines our plans and expected outcomes, laying a solid foundation for our collaboration." }
            ].map((step, i) => (
              <div key={i} className="bg-[#0b1015]/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/10 hover:border-[#3AE272]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(58,226,114,0.1)] relative z-10 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3AE272]/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-[#3AE272]/15 transition-colors"></div>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a2530] to-[#111820] flex items-center justify-center text-[#3AE272] border border-white/5 shadow-inner">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">{step.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          4. WHY WE SHOULD BE YOUR #1 CHOICE?
      ========================================== */}
      <section className="py-24 relative">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="bg-gradient-to-br from-[#131b24] to-[#0a0f14] rounded-[3rem] p-8 md:p-16 border border-[#3AE272]/20 shadow-[0_0_50px_rgba(58,226,114,0.05)] flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-hidden relative">
            
            {/* Glowing orb */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#3AE272]/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex-1 relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Why We Should Be Your <span className="text-[#3AE272]">#1 Choice?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                We don’t just run campaigns; we build digital empires. Our data-driven methodology ensures every rupee spent turns into measurable growth.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Data-Driven ROI", text: "Hard numbers, no fluff. We track and optimize for revenue, not just likes." },
                  { title: "Elite Creative Execution", text: "Scroll-stopping visuals that make your brand impossible to ignore." },
                  { title: "Transparent Reporting", text: "You always know where your money goes and what it brings back." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#3AE272]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side visual */}
            <div className="lg:w-5/12 w-full relative z-10 hidden md:block">
               <div className="aspect-square rounded-full border border-dashed border-[#3AE272]/30 flex items-center justify-center p-8 relative animate-[spin_60s_linear_infinite]">
                  <div className="w-full h-full rounded-full border border-[#3AE272]/20 flex items-center justify-center p-8">
                     <div className="w-full h-full rounded-full bg-[#3AE272]/10 blur-xl"></div>
                  </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <Award size={100} className="text-[#3AE272] drop-shadow-[0_0_30px_rgba(58,226,114,0.6)]" strokeWidth={1} />
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          5. OUR WORK (Case Studies Gallery)
      ========================================== */}
      <section className="py-12 relative">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our <span className="text-[#3AE272]">Work</span></h2>
              <p className="text-slate-400 text-lg max-w-lg">Real results for real brands. Peek into our success stories.</p>
            </div>
            <Link href="/case-studies" className="text-[#3AE272] font-bold hover:underline underline-offset-4 mb-2">View All Portfolio →</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              { title: "10x ROAS for E-com Brand", tag: "Performance Ads", img: "1460925895917-afdab827c52f" },
              { title: "2M+ Views on Single Reel", tag: "Social Growth", img: "1611162617213-7d7a39e9b1d7" }
            ].map((work, i) => (
              <div key={i} className="group relative rounded-[2rem] overflow-hidden aspect-video bg-slate-900 cursor-pointer">
                <img src={`https://images.unsplash.com/photo-${work.img}?w=800&h=600&fit=crop`} alt={work.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="bg-[#3AE272] text-[#022c22] text-xs font-bold px-3 py-1 rounded-full w-max mb-4 uppercase tracking-widest">{work.tag}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{work.title}</h3>
                  <div className="flex items-center text-[#3AE272] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Read Case Study <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. SOME OF THE QUESTIONS (FAQ Native Accordion)
      ========================================== */}
      <section className="py-24 relative max-w-[800px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Some of The <span className="text-[#3AE272]">Questions</span></h2>
          <p className="text-slate-400">Everything you need to know about working with us.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "What distinguishes your social media marketing services from others?", a: "We combine deep data analytics with highly creative storytelling. We don't just post; we create movements that generate measurable ROI." },
            { q: "How often will you update our social media profiles?", a: "Consistency is key! Depending on the strategy, we typically post 4-7 times a week across active platforms to keep engagement high." },
            { q: "Can you assist with social media campaigns?", a: "Absolutely. From ideation and influencer outreach to ad spend management, we handle end-to-end campaign execution." },
            { q: "How is success measured in social media marketing?", a: "We track metrics that matter to your bottom line: Lead volume, Cost Per Acquisition (CPA), Conversion Rates, and overall Return on Ad Spend (ROAS)." },
            { q: "What kinds of content do you produce for social media?", a: "Everything from viral short-form videos (Reels/TikToks) and high-quality graphics to interactive polls and thought-leadership carousels." }
          ].map((faq, i) => (
            <details key={i} className="group bg-[#0b1015]/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-bold text-lg select-none outline-none">
                {faq.q}
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-open:rotate-180 transition-transform duration-300 border border-white/10">
                  <ChevronDown className="w-5 h-5 text-[#3AE272]" />
                </span>
              </summary>
              <div className="px-6 pb-6 text-slate-400 font-medium text-sm md:text-base leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ==========================================
          7. FINAL CTA
      ========================================== */}
      <section className="py-12 pb-24 relative max-w-[1100px] mx-auto px-6 md:px-8 text-center">
         <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
           Let us transform your ideas into <br className="hidden md:block"/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE272] to-[#6ee7b7]">captivating visuals</span> that elevate your brand.
         </h2>
         <Link href="/contact" className="inline-flex items-center gap-2 bg-[#3AE272] text-[#022c22] font-bold py-4 px-10 rounded-xl hover:bg-[#4df287] transition-all shadow-[0_0_30px_rgba(58,226,114,0.3)] hover:-translate-y-1 text-lg">
            Start Your Project <TrendingUp size={20} />
         </Link>
      </section>

    </div>
  );
}