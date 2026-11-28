import React from "react";
import { ArrowRight, Briefcase, ChevronRight, X } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { getStoredCaseStudies } from "../data/catalog.js";

export function CaseStudyDetailPage({ slug, onNavigate }) {
  const currentCases = getStoredCaseStudies();
  const cs = currentCases.find((c) => c.slug === slug);

  if (!cs) {
    return (
      <PageLayout
        onNavigate={onNavigate}
        activeNav="case-studies"
        fullWidth={true}
      >
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24 bg-[#0f172a] text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-[#cfff04]">
            <Briefcase className="w-8 h-8" />
          </div>
          <span className="text-[#cfff04] text-xs font-mono font-bold uppercase tracking-widest mb-2">404  — Not Found</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Case Study Not Found</h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed mb-8">
            This case study may have been removed, unpublished, or the link has changed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("/case-studies")}
              className="bg-[#cfff04] text-[#0f172a] px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
            >
              â† Back to Case Studies
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/services")}
              className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all cursor-pointer"
            >
              Explore Growth Services
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(`Case Study Strategy: ${cs.brand || cs.title}`);

  // Dynamic next case study calculation
  const currentIndex = currentCases.findIndex((c) => c.slug === cs.slug);
  const nextCase = currentCases.length > 1 ? currentCases[(currentIndex + 1) % currentCases.length] : null;

  // Dynamic fallbacks
  const headlinePrefix = cs.headlinePrefix || cs.title || "Scaling Growth for ";
  const headlineHighlight = cs.headlineHighlight || "";
  const headlineSuffix = cs.headlineSuffix || "";
  const heroDesc = cs.heroDescription || cs.challenge || "How we engineered full-funnel acquisition and maximized blended ROAS.";
  const heroImg = cs.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";

  const tags = (Array.isArray(cs.tags) && cs.tags.length > 0)
    ? cs.tags
    : [cs.category || "E-Commerce", ...(cs.services || []).slice(0, 2)];

  const stats = (Array.isArray(cs.stats) && cs.stats.length > 0)
    ? cs.stats
    : (Array.isArray(cs.results) && cs.results.length > 0
        ? cs.results.map((r, i) => ({ val: r.val, label: r.label, highlight: i < 3 }))
        : [
            { val: cs.metric || "300%", label: cs.result || "Revenue Growth", highlight: true },
            { val: cs.stat1?.val || "5.2x", label: cs.stat1?.label || "Blended ROAS", highlight: true },
            { val: cs.stat2?.val || "-42%", label: cs.stat2?.label || "Cost Per Acq.", highlight: true },
            { val: "90", label: "Days to Scale", highlight: false }
          ]);

  const challengeParagraphs = (Array.isArray(cs.challengeParagraphs) && cs.challengeParagraphs.length > 0)
    ? cs.challengeParagraphs
    : [cs.challenge || "UrbanThreads Co. had a great product, but they hit a hard plateau in customer acquisition."];

  const obstacles = (Array.isArray(cs.obstacles) && cs.obstacles.length > 0)
    ? cs.obstacles
    : [
        "Ad creative lifespan was less than 5 days.",
        "Zero retargeting funnel; 98% of visitors bounced forever.",
        "High CPMs due to broad, unsegmented audience targeting."
      ];

  const approachIntro = cs.approachIntro || cs.strategy || "We didn't just tweak bids; we rebuilt their entire acquisition engine from the ground up.";

  const approachSteps = (Array.isArray(cs.approachSteps) && cs.approachSteps.length > 0)
    ? cs.approachSteps
    : [
        {
          step: 1,
          title: 'The "UGC First" Creative Pipeline',
          desc: "We sourced authentic creator content to test 20+ variations weekly to defeat fatigue."
        },
        {
          step: 2,
          title: "Account Consolidation & Segmentation",
          desc: "Collapsed fragmented ad accounts into high-signal prospecting and retargeting pools."
        },
        {
          step: 3,
          title: "Omnichannel Scaling & CRO",
          desc: "Optimized landing page conversion rates and paired search capture with paid social demand."
        }
      ];

  const creativeExecution = (Array.isArray(cs.creativeExecution) && cs.creativeExecution.length > 0)
    ? cs.creativeExecution
    : [
        {
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          title: "Top Performing UGC Ad",
          metric: "ROAS: 6.8x"
        },
        {
          image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          title: "Dynamic Product Catalog",
          metric: "CTR: 3.2%"
        },
        {
          image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          title: "Lifestyle Carousel",
          metric: "CPA: -35% vs baseline"
        }
      ];

  const testimonial = cs.testimonial || {
    quote: "GetIntoFeed didn't just run our ads; they became an extension of our growth team. Their creative strategy was exactly what we were missing.",
    author: `${cs.brand} Leadership`,
    role: "Founder & CEO",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  };

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
      <div className="w-full max-w-full overflow-x-hidden font-inter text-[#111827] bg-[#ffffff] antialiased">
        {/* Hero Section with Dot Grid Pattern */}
        <section
          className="pt-12 pb-16 md:pt-20 md:pb-24 bg-white relative overflow-hidden text-left"
          style={{
            backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white pointer-events-none" />

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            {/* Breadcrumbs */}
            <nav className="text-sm text-[#4b5563] mb-8 flex items-center gap-2 font-medium flex-wrap">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#111827] transition bg-transparent border-none p-0 cursor-pointer text-sm text-[#4b5563]"
              >
                Home
              </button>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <button
                type="button"
                onClick={() => onNavigate("/case-studies")}
                className="hover:text-[#111827] transition bg-transparent border-none p-0 cursor-pointer text-sm text-[#4b5563]"
              >
                Case Studies
              </button>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-[#111827] font-semibold">{cs.brand}</span>
            </nav>

            {/* Tags Strip */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-6">
              {tags.map((tag, idx) => {
                const isNeon =
                  idx === 1 ||
                  tag.toLowerCase().includes("ads") ||
                  tag.toLowerCase().includes("growth") ||
                  tag.toLowerCase().includes("performance");
                return (
                  <span
                    key={idx}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      isNeon
                        ? "bg-[#cfff04] text-[#111827]"
                        : "bg-gray-100 text-[#111827]"
                    }`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>

            {/* Giant Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-[#111827] tracking-tight">
              {headlinePrefix}
              {headlineHighlight && (
                <> <span className="bg-[#cfff04] px-2 text-[#111827] inline-block">{headlineHighlight}</span></>
              )}
              {headlineSuffix && <> {headlineSuffix}</>}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-[#4b5563] max-w-3xl mb-8 md:mb-12 leading-relaxed font-light">
              {heroDesc}
            </p>
          </div>
        </section>

        {/* Featured Image & Dark Stats Bar */}
        <section className="relative z-20 -mt-10 mb-16 md:mb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Featured Image */}
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 mb-8 md:mb-10 h-[280px] sm:h-[400px] md:h-[600px] w-full">
              <img
                src={heroImg}
                alt={`${cs.brand} Campaign Showcase`}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            {/* High-Impact Stats Bar */}
            <div className="bg-[#0f172a] rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x divide-gray-700/50">
                {stats.map((st, idx) => (
                  <div key={idx} className="text-center md:text-left px-2 sm:px-4">
                    <div
                      className={`text-3xl sm:text-4xl md:text-5xl font-black mb-2 ${
                        st.highlight !== false ? "text-[#cfff04]" : "text-white"
                      }`}
                    >
                      {st.val}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider font-semibold">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge & Our Approach Section */}
        <section className="py-10 md:py-14 bg-white text-left">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* The Challenge */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
              <div className="md:col-span-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-[#111827] mb-4 border-b-2 border-[#cfff04] pb-2 inline-block">
                  The Challenge
                </h3>
              </div>
              <div className="md:col-span-8">
                {challengeParagraphs.map((para, idx) => (
                  <p key={idx} className="text-base sm:text-lg text-[#4b5563] leading-[1.8] mb-6">
                    {para}
                  </p>
                ))}

                {obstacles && obstacles.length > 0 && (
                  <div className="bg-[#f9fafb] p-6 rounded-xl border border-gray-100 mt-6">
                    <h4 className="font-bold text-[#111827] mb-3">Key Obstacles:</h4>
                    <ul className="space-y-2.5 text-[#4b5563]">
                      {obstacles.map((obs, idx) => (
                        <li key={idx} className="flex items-start text-sm sm:text-base">
                          <X className="w-4 h-4 text-red-500 mt-1 mr-3 shrink-0" />
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Our Approach */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
              <div className="md:col-span-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-[#111827] mb-4 border-b-2 border-[#cfff04] pb-2 inline-block">
                  Our Approach
                </h3>
              </div>
              <div className="md:col-span-8">
                <p className="text-base sm:text-lg text-[#4b5563] leading-[1.8] mb-6">
                  {approachIntro}
                </p>

                {approachSteps.map((stepItem, idx) => (
                  <div key={idx} className="mt-8 flex gap-4 sm:gap-6 items-start">
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#cfff04] rounded-full flex items-center justify-center font-black text-lg sm:text-xl text-[#111827] shadow-sm">
                      {stepItem.step || idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">
                        {stepItem.title}
                      </h4>
                      <p className="text-[#4b5563] leading-[1.8] text-sm sm:text-base">
                        {stepItem.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Creative Execution */}
        <section className="py-16 bg-[#f9fafb] border-y border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827] text-center mb-10 md:mb-12">
              The Creative Execution
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creativeExecution.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden shadow-sm group bg-white border border-gray-100 text-left transition hover:shadow-md"
                >
                  <div className="w-full h-72 sm:h-80 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="bg-white p-4 border-t border-gray-100">
                    <div className="font-bold text-sm text-[#111827]">{item.title}</div>
                    <div className="text-xs text-[#4b5563] mt-0.5 font-medium">{item.metric}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Testimonial */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-block text-[#cfff04] mb-6">
              <svg className="w-12 h-12 fill-current mx-auto" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-[#111827] leading-tight mb-8 max-w-3xl mx-auto">
              "{testimonial.quote}"
            </h2>

            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"
                loading="lazy"
                decoding="async"
                width="56"
                height="56"
              />
              <div className="text-left">
                <div className="font-bold text-[#111827]">{testimonial.author}</div>
                <div className="text-sm text-[#4b5563]">{testimonial.role}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Dark CTA & Next Case Study */}
        <section className="bg-[#0f172a] py-14 sm:py-16 mt-8">
          <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10">
            {/* CTA */}
            <div className="text-center md:text-left md:w-1/2">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                Want Results Like This?
              </h3>
              <p className="text-gray-400 mb-6 font-light text-sm sm:text-base leading-relaxed">
                Let's audit your current ad accounts and creative strategy to find your hidden growth levers.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedService(`Case Study Strategy: ${cs.brand}`);
                  setLeadModalOpen(true);
                }}
                className="bg-[#cfff04] text-[#111827] font-bold py-3.5 sm:py-4 px-8 rounded-full hover:bg-[#b8e600] transition uppercase tracking-wide shadow-[0_4px_14px_0_rgba(207,255,4,0.39)] cursor-pointer active:scale-95 inline-flex items-center justify-center text-xs sm:text-sm"
              >
                Book A Free Strategy Call
              </button>
            </div>

            {/* Next Case Study / All Case Studies */}
            <div className="md:w-1/2 w-full">
              {nextCase ? (
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    onNavigate(`/case-studies/${nextCase.slug}`);
                  }}
                  className="w-full text-left block bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition group cursor-pointer"
                >
                  <div className="text-[#cfff04] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Next Case Study{" "}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {nextCase.brand || nextCase.title}
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
                    {nextCase.heroDescription || nextCase.challenge}
                  </p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    onNavigate("/case-studies");
                  }}
                  className="w-full text-left block bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition group cursor-pointer"
                >
                  <div className="text-[#cfff04] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Explore All Projects{" "}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Commercial Case Studies &amp; Results
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
                    Browse verified client outcomes and full-funnel performance marketing audits.
                  </p>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default CaseStudyDetailPage;
