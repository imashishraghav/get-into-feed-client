"use client";

import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, TrendingUp, Share2, PenTool, Users, BarChart, Target, Globe, Check } from 'lucide-react';

export default function PricingPage() {
  const [activeService, setActiveService] = useState("Performance Marketing");
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const services = [
    {
      title: "Performance Marketing",
      description: "Data-driven campaigns and targeted ads to maximize your ROI and drive measurable growth.",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "Social Media Marketing",
      description: "Engaging content and community management to build your brand across all major platforms.",
      icon: <Share2 className="w-6 h-6" />
    },
    {
      title: "Branding and Strategy",
      description: "Comprehensive brand positioning, visual identity, and strategic planning to stand out.",
      icon: <PenTool className="w-6 h-6" />
    },
    {
      title: "Influencer Marketing",
      description: "Connect with powerful voices and creators to authentically amplify your brand's message.",
      icon: <Users className="w-6 h-6" />
    }
  ];

  const pricingDetails = {
    "Performance Marketing": {
      subtitle: "Scale your growth with data-driven campaigns. Choose a plan that matches your current stage and ambition.",
      plans: [
        {
          label: "ESSENTIAL", name: "Starter", price: "₹49,999", isCustom: false,
          features: ["Up to ₹2L Monthly Spend", "2 Ad Channels (Meta/Google)", "Basic Performance Dashboard", "Monthly Strategy Sync"],
          buttonText: "Start Growing", style: "default"
        },
        {
          label: "ACCELERATE", name: "Growth", price: "₹99,999", isCustom: false, badge: "MOST POPULAR",
          features: ["Up to ₹10L Monthly Spend", "4 Ad Channels", "Advanced Funnel Tracking", "Bi-weekly Optimization", "Creative A/B Testing"],
          buttonText: "Get Started", style: "popular"
        },
        {
          label: "OPTIMIZE", name: "Professional", price: "₹1,99,999", isCustom: false,
          features: ["Up to ₹50L Monthly Spend", "Unlimited Ad Channels", "Conversion Rate Optimization", "Dedicated Account Manager", "Weekly Reporting Calls"],
          buttonText: "Go Professional", style: "default"
        },
        {
          label: "DOMINANCE", name: "Enterprise", price: "Custom", isCustom: true,
          features: ["₹50L+ Monthly Spend", "Full Funnel Infrastructure", "Custom API Integrations", "24/7 Priority Support", "Global Strategy Consulting"],
          buttonText: "Talk to Sales", style: "outline"
        }
      ]
    },
    "Social Media Marketing": {
      subtitle: "Build a loyal community and engaging presence across all social platforms.",
      plans: [
        {
          label: "ESSENTIAL", name: "Starter", price: "₹29,999", isCustom: false,
          features: ["2 Platforms Managed", "12 Custom Posts / Month", "Basic Community Management", "Monthly Analytics Report"],
          buttonText: "Start Growing", style: "default"
        },
        {
          label: "ACCELERATE", name: "Growth", price: "₹59,999", isCustom: false, badge: "MOST POPULAR",
          features: ["4 Platforms Managed", "20 Custom Posts / Month", "4 Short-form Videos (Reels)", "Proactive Engagement", "Bi-weekly Reporting"],
          buttonText: "Get Started", style: "popular"
        },
        {
          label: "OPTIMIZE", name: "Professional", price: "₹1,19,999", isCustom: false,
          features: ["Unlimited Platforms", "Daily Posting Schedule", "10 Short-form Videos / Month", "Influencer Collaboration Prep", "Dedicated Content Manager"],
          buttonText: "Go Professional", style: "default"
        },
        {
          label: "DOMINANCE", name: "Enterprise", price: "Custom", isCustom: true,
          features: ["Bespoke Content Strategy", "Full Video Production Team", "24/7 Trend Reactivity", "Custom PR Integration", "Omnichannel Content Scaling"],
          buttonText: "Talk to Sales", style: "outline"
        }
      ]
    },
    "Branding and Strategy": {
      subtitle: "Define your market position and create a visual identity that demands attention.",
      plans: [
        {
          label: "ESSENTIAL", name: "Starter", price: "₹79,999", isCustom: false,
          features: ["Brand Identity Refresh", "Basic Logo Updates", "Typography & Color Palette", "Competitor Analysis"],
          buttonText: "Start Growing", style: "default"
        },
        {
          label: "ACCELERATE", name: "Growth", price: "₹1,49,999", isCustom: false, badge: "MOST POPULAR",
          features: ["Full Visual Identity System", "Comprehensive Brand Book", "Positioning Strategy", "Market Research Report", "Bi-weekly Consulting Call"],
          buttonText: "Get Started", style: "popular"
        },
        {
          label: "OPTIMIZE", name: "Professional", price: "₹2,99,999", isCustom: false,
          features: ["Complete Go-to-Market Strategy", "Sub-brand Architecture", "Employer Branding Guidelines", "Executive Positioning", "Dedicated Strategy Lead"],
          buttonText: "Go Professional", style: "default"
        },
        {
          label: "DOMINANCE", name: "Enterprise", price: "Custom", isCustom: true,
          features: ["Global Rebranding Campaign", "Merger/Acquisition Brand Integration", "Custom Deep-Dive Market Research", "Ongoing Board Advisory", "VIP Support Team"],
          buttonText: "Talk to Sales", style: "outline"
        }
      ]
    },
    "Influencer Marketing": {
      subtitle: "Tap into engaged audiences through powerful creator partnerships and authentic storytelling.",
      plans: [
        {
          label: "ESSENTIAL", name: "Starter", price: "₹39,999", isCustom: false,
          features: ["Up to 5 Micro-Influencers", "Basic Campaign Briefing", "Content Review & Approval", "Reach & Engagement Reporting"],
          buttonText: "Start Growing", style: "default"
        },
        {
          label: "ACCELERATE", name: "Growth", price: "₹89,999", isCustom: false, badge: "MOST POPULAR",
          features: ["10-15 Micro/Mid Influencers", "End-to-end Campaign Management", "Extended Content Usage Rights", "Advanced Performance Tracking", "Ad Whitelisting Setup"],
          buttonText: "Get Started", style: "popular"
        },
        {
          label: "OPTIMIZE", name: "Professional", price: "₹1,79,999", isCustom: false,
          features: ["Macro & Celebrity Outreach", "Long-term Ambassador Programs", "UGC Procurement At Scale", "Advanced ROI & Conversion Analytics", "Dedicated Campaign Manager"],
          buttonText: "Go Professional", style: "default"
        },
        {
          label: "DOMINANCE", name: "Enterprise", price: "Custom", isCustom: true,
          features: ["Global Influencer Network Access", "Bespoke Event Activations", "Product Seeding at Scale", "Custom Legal & Contracting", "Creator Royalty Management"],
          buttonText: "Talk to Sales", style: "outline"
        }
      ]
    }
  };

  const faqs = [
    {
      question: "Do you require long-term contracts?",
      answer: "No, our Growth and Scale plans are month-to-month. However, we recommend a minimum 3-month commitment to allow our SEO and algorithmic ad campaigns to properly learn and optimize for the best ROI."
    },
    {
      question: "How does ad spend work?",
      answer: "Your ad spend is billed directly by the platforms (Google, Meta, TikTok, etc.). Our pricing covers the strategic management, creative asset design, and continuous daily optimization of those campaigns."
    },
    {
      question: "Can I customize my marketing package?",
      answer: "Absolutely. While our standard tiers cover most needs, we understand every brand is unique. We can build a completely bespoke package tailored to your specific goals, industry, and budget."
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes. You can upgrade or adjust your services at any time as your business scales. Your dedicated account manager will help transition your strategy seamlessly to ensure no loss of momentum."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#070b14] text-zinc-300 font-sans selection:bg-green-500/30 selection:text-green-200 overflow-hidden cursor-default">
      {/* Custom Follower Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-green-500/60 pointer-events-none z-[100] transition-transform duration-100 ease-out hidden md:block"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Google Font Import & Custom Utility */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@600&display=swap');
        .font-raleway { font-family: 'Raleway', sans-serif; }
      `}} />

      <div className="relative z-10 pt-16">
        {/* Header Section */}
        <section className="pt-24 pb-12 px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-raleway font-semibold text-white tracking-tight mb-6">
            Transparent Pricing for Every Stage
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
            From passionate startups to enterprise brands, we offer tailored marketing packages designed to drive traffic, generate high-quality leads, and maximize your ROI.
          </p>
        </section>

        {/* Services / Tab Selection Section */}
        <section className="px-6 pb-12 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {services.map((service, index) => {
              const isActive = activeService === service.title;
              return (
                <div
                  key={index}
                  onClick={() => setActiveService(service.title)}
                  className={`backdrop-blur-sm p-8 rounded-3xl border transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? 'bg-zinc-900 border-green-500 shadow-[0_0_20px_rgba(74,222,128,0.15)] -translate-y-2'
                      : 'bg-zinc-900/40 border-white/5 hover:border-green-500/50 hover:-translate-y-2'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-black shadow-lg shadow-green-900/40'
                      : 'bg-green-500/10 border border-green-500/20 text-green-400 group-hover:bg-gradient-to-br group-hover:from-green-400 group-hover:to-green-600 group-hover:text-black'
                  }`}>
                    {service.icon}
                  </div>
                  <h3 className={`text-xl font-raleway font-semibold mb-3 ${isActive ? 'text-green-400' : 'text-white'}`}>
                    {service.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Pricing Section */}
        <section className="px-6 pb-24 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-raleway font-semibold text-white tracking-tight mb-4">
              {activeService}
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              {pricingDetails[activeService].subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingDetails[activeService].plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col p-8 rounded-2xl ${
                  plan.style === 'popular'
                    ? 'bg-[#0f0f0f] border border-white/10'
                    : 'bg-[#0a0a0a] border border-white/5'
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-block bg-[#1ed760] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <p className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">
                  {plan.label}
                </p>
                <h3 className="text-2xl font-raleway font-semibold text-white mb-6">
                  {plan.name}
                </h3>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {plan.price}
                  </span>
                  {!plan.isCustom && <span className="text-sm text-zinc-500 ml-1">/month</span>}
                  {plan.isCustom && <span className="text-sm text-zinc-500 ml-1">/month</span>}
                </div>

                <ul className="flex-1 space-y-5 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 shrink-0 text-zinc-300" strokeWidth={2.5} />
                      <span className="text-sm text-zinc-300 leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3.5 rounded-lg font-semibold transition-colors text-sm ${
                    plan.style === 'popular'
                      ? 'bg-[#1ed760] text-black hover:bg-[#1db954]'
                      : plan.style === 'outline'
                        ? 'bg-transparent border border-white/20 text-white hover:bg-white/5'
                        : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Features Banner */}
        <section className="border-y border-white/5 bg-zinc-950/50 backdrop-blur-sm py-16 px-6 relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-5">
                <Target className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-raleway font-semibold text-white mb-2">Data-Driven Results</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">We don't rely on guesswork. Every campaign is backed by deep analytics, A/B testing, and consumer behavior insights.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-5">
                <BarChart className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-raleway font-semibold text-white mb-2">Transparent Reporting</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Access your custom live dashboard 24/7 to see exactly where your budget is going and track your live CPA and ROAS.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-5">
                <Globe className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-raleway font-semibold text-white mb-2">Omnichannel Strategy</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Seamlessly connect your brand message across search, social media, email, and programmatic display networks.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-raleway font-semibold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400">Have a different question? <a href="#" className="text-green-400 hover:text-green-300 hover:underline transition-colors">Contact our support team</a>.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-zinc-900/30 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-lg font-raleway font-semibold text-white mb-3 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  {faq.question}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}