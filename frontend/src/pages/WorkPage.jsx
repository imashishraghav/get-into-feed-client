import React, { useState, useEffect } from "react";
import { ArrowUpRight, Briefcase, Filter } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { getStoredCaseStudies } from "../data/catalog.js";

export function WorkPage({ onNavigate }) {
  const [filter, setFilter] = useState("All Work");
  const [visibleCount, setVisibleCount] = useState(4);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Performance Marketing & Scaling");
  const [currentCases, setCurrentCases] = useState(getStoredCaseStudies);

  useEffect(() => {
    const handleStorage = () => {
      setCurrentCases(getStoredCaseStudies());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const categories = [
    "All Work",
    "Paid Media",
    "Content & Social",
    "SEO",
    "E-Commerce",
    "Real Estate"
  ];

  const filtered = currentCases.filter((cs) => {
    if (filter === "All Work") return true;
    if (cs.filterCategories && cs.filterCategories.includes(filter)) return true;
    if (cs.category === filter || cs.subTag === filter) return true;
    if (filter === "SEO" && (cs.category?.includes("SEO") || cs.subTag?.includes("SEO") || cs.services?.some((s) => s.toLowerCase().includes("seo")))) return true;
    if (filter === "Paid Media" && (cs.category?.includes("Paid") || cs.subTag?.includes("Paid") || cs.services?.some((s) => s.toLowerCase().includes("ads") || s.toLowerCase().includes("paid")))) return true;
    if (filter === "Content & Social" && (cs.category?.includes("Social") || cs.subTag?.includes("Social") || cs.services?.some((s) => s.toLowerCase().includes("social") || s.toLowerCase().includes("content") || s.toLowerCase().includes("video")))) return true;
    if (filter === "E-Commerce" && (cs.category?.includes("E-Commerce") || cs.subTag?.includes("E-Commerce"))) return true;
    if (filter === "Real Estate" && (cs.category?.includes("Real Estate") || cs.subTag?.includes("Real Estate"))) return true;
    return false;
  });

  const visibleCases = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="case-studies"
      fullWidth={true}
      leadModalOpen={leadModalOpen}
      setLeadModalOpen={setLeadModalOpen}
      selectedService={selectedService}
      setSelectedService={setSelectedService}
    >
      <div className="w-full max-w-full overflow-x-hidden font-inter text-[#111827] bg-[#ffffff]">
        {/* HERO SECTION (Standardized with Services, Pricing, About & Contact) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10">
          <div className="services-hero-bg rounded-3xl p-6 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-800/90 min-h-[300px] flex items-center">
            
            {/* Decorative Geometric Ring Graphic (Adaptive for Mobile & Desktop) */}
            <div className="absolute right-[-40px] sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-85 sm:opacity-90 transition-opacity">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className="w-full h-full rounded-full border-[28px] sm:border-[36px] border-[#d2ff00]/25 flex items-center justify-center">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#d2ff00]/50 -translate-x-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
                  </svg>
                </div>
                <div className="absolute -top-4 right-4 w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-[#d2ff00]/40 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#d2ff00]/30"></div>
                </div>
              </div>
            </div>

            {/* Hero Copy & Verified Results Badges */}
            <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#e7ff8a]">
                <span className="w-[11px] h-[11px] rounded-[3px] bg-[#d4ff00] border-2 border-[#2563eb] inline-block shrink-0 box-border" />
                PROVEN COMMERCIAL RESULTS
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
                We build brands that <br className="hidden sm:inline" />
                <span className="text-[#d4ff00]">people can't scroll past.</span>
              </h1>

              <p className="text-[#d4dcf0] text-[14.5px] sm:text-[15px] leading-[1.55] max-w-xl font-normal pt-1">
                Explore how we've helped ambitious brands turn attention into predictable pipeline, high ROAS, and verified revenue through performance marketing and creative execution.
              </p>

              {/* Verified Results Metrics Badges */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-2.5">
                  <span className="text-lg sm:text-xl font-extrabold text-[#d2ff00] leading-none">₹150Cr+</span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Revenue Generated</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-2.5">
                  <span className="text-lg sm:text-xl font-extrabold text-[#d2ff00] leading-none">4.6x</span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Average ROAS</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-2.5">
                  <span className="text-lg sm:text-xl font-extrabold text-[#d2ff00] leading-none">250M+</span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Total Impressions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Sticky Filter Bar */}
        <section className="py-5 sm:py-8 md:py-10 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-xs">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {categories.map((cat) => {
                const isActive = filter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFilter(cat);
                      setVisibleCount(4);
                    }}
                    className={`filter-btn px-4 sm:px-6 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#111827] text-white border-[#111827] shadow-sm"
                        : "border-gray-300 text-[#4b5563] hover:bg-gray-100 hover:text-[#111827] bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Case Studies Grid */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#f9fafb]">
          <div className="container mx-auto px-4 max-w-7xl">
            {visibleCases.length === 0 ? (
              <div className="py-20 text-center max-w-xl mx-auto px-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5 text-gray-400">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#111827] mb-3">No Case Studies Published Yet</h3>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">
                  Our growth teardowns and commercial results are currently being curated. Case studies published from the Content Studio will appear here live.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("/services")}
                  className="inline-flex items-center gap-2 bg-[#111827] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black transition-all cursor-pointer"
                >
                  Explore Growth Services
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
              {visibleCases.map((cs) => (
                <div
                  key={cs.slug}
                  onClick={() => onNavigate(`/case-studies/${cs.slug}`)}
                  className="case-study-card group block bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left"
                >
                  <div className="relative h-60 sm:h-64 md:h-80 overflow-hidden bg-gray-200">
                    <img
                      src={cs.heroImage}
                      alt={cs.brand || cs.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-white/90 backdrop-blur text-[#111827] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {cs.category}
                      </span>
                      {cs.subTag && (
                        <span className="bg-[#cfff04] text-[#111827] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {cs.subTag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-black mb-3 text-[#111827] group-hover:text-[#84a300] transition-colors">
                      {cs.brand}
                    </h3>
                    <p className="text-[#4b5563] text-sm sm:text-base mb-6 line-clamp-2 leading-relaxed">
                      {cs.challenge || cs.title}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                      <div>
                        <div className="text-2xl font-black text-[#111827]">
                          {cs.stat1?.val || cs.metric || "300%"}
                        </div>
                        <div className="text-xs text-[#4b5563] uppercase font-semibold mt-1">
                          {cs.stat1?.label || cs.result || "Revenue Growth"}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-[#111827]">
                          {cs.stat2?.val || (cs.results && cs.results[1]?.val) || "5.2x"}
                        </div>
                        <div className="text-xs text-[#4b5563] uppercase font-semibold mt-1">
                          {cs.stat2?.label || (cs.results && cs.results[1]?.label) || "Blended ROAS"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-[#111827] font-bold text-sm uppercase tracking-wider group-hover:text-[#84a300] transition-colors">
                      Read Case Study
                      <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Pagination / Load More */}
            {hasMore && (
              <div className="text-center mt-12 sm:mt-16">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="bg-white border-2 border-[#111827] text-[#111827] font-bold py-3 px-8 sm:px-10 rounded-full hover:bg-[#111827] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Load More Projects
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Closing Neon Call To Action (Expanded Full-Width Container) */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-[#d2ff00] rounded-3xl sm:rounded-[2.5rem] py-12 sm:py-16 md:py-20 px-6 sm:px-12 md:px-16 text-center shadow-[0_15px_50px_rgba(210,255,0,0.35)] border border-[#b8e600] relative overflow-hidden">
              {/* Subtle ambient background glow rings */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/20 pointer-events-none select-none blur-2xl"></div>
              <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-white/15 pointer-events-none select-none blur-2xl"></div>

              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#111827] mb-4 sm:mb-6 leading-tight tracking-tight">
                  Want Your Brand To Be <br />
                  Our Next Success Story?
                </h2>
                <p className="text-[#111827]/85 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium text-base sm:text-xl leading-relaxed">
                  Stop leaving money on the table. Let's build a strategy that actually moves the needle for your business.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService("Case Studies - Next Success Story");
                      setLeadModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-[#0f172a] text-white font-bold py-4 px-8 sm:px-12 rounded-full hover:bg-black transition-all uppercase tracking-wider shadow-lg cursor-pointer active:scale-95 text-sm sm:text-base"
                  >
                    Start a Project
                  </button>
                  <a
                    href="tel:+918810356950"
                    className="w-full sm:w-auto bg-white text-[#111827] font-bold py-4 px-8 sm:px-12 rounded-full hover:bg-gray-50 transition-all border border-gray-200 shadow-xs cursor-pointer active:scale-95 text-sm sm:text-base inline-flex items-center justify-center gap-2"
                  >
                    Book Discovery Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default WorkPage;
