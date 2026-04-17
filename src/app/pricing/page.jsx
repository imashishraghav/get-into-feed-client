"use client";

import React, { useState, useEffect } from 'react';
import { 
  Target, Check, ChevronDown, 
  ArrowRight, ShieldCheck, Minus, Plus, 
  Search, Layers, ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "next-sanity";
// Import your custom currency utility
import { getLiveRates } from '@/utils/currency'; // Adjust path if not using '@' alias

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// --- AWWWARDS-LEVEL ANIMATION CONFIG ---
const premiumEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const services = [
  { title: 'Performance Marketing', icon: <Target className="w-4 h-4" /> },
  { title: 'SEO Dominance', icon: <Search className="w-4 h-4" /> },
  { title: 'Creative Studio', icon: <Layers className="w-4 h-4" /> }
];

const faqs = [
  {
    q: "Do you require long-term contracts?",
    a: "We operate on a 90-day initial performance sprint for all new Growth Retainers. This allows our data science team to build predictive models and exit the algorithm's learning phase. Following this period, we transition to a rolling month-to-month agreement with a 30-day notice."
  },
  {
    q: "How does the Performance Partnership fee work?",
    a: "The performance model consists of a baseline management fee to cover technical infrastructure and elite operational costs, plus a negotiated percentage of top-line revenue generated directly from our attributed campaigns."
  },
  {
    q: "Is creative production included in the retainer?",
    a: "Our growth squads include creative strategists who handle art direction, scripting, and rapid iteration of existing assets. Full net-new cinematic video production or high-end 3D shoots are quoted separately based on project complexity."
  }
];

export default function PricingPage() {
  const [activeService, setActiveService] = useState(services[0].title);
  const [isMonthly, setIsMonthly] = useState(true); 
  const [sanityPlans, setSanityPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0); 
  
  // Real-time Currency States
  const [currency, setCurrency] = useState('INR'); // Default is INR
  const [exchangeRates, setExchangeRates] = useState(null); 
  const [availableCurrencies, setAvailableCurrencies] = useState(['INR', 'USD', 'EUR', 'GBP', 'AED']);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const query = `*[_type == "pricing"] | order(order asc) {
          _id, planName, description, monthlyPrice, oneTimePrice, features, isPopular, category, badge
        }`;
        const data = await client.fetch(query);
        
        if(data.length === 0) throw new Error("Empty sanity");
        
        const grouped = data.reduce((acc, plan) => {
          if (!acc[plan.category]) acc[plan.category] = [];
          acc[plan.category].push(plan);
          return acc;
        }, {});
        setSanityPlans(grouped);
      } catch (error) {
        console.log("Using premium fallback data");
        setSanityPlans({
          'Performance Media': [
            { _id: 'pm-1', planName: 'Growth Retainer', monthlyPrice: 5000, oneTimePrice: 50000, isPopular: false, badge: '', description: 'Scale to 8-figures', features: ['Omnichannel Media Buying', 'Continuous Creative Testing', 'Advanced Conversion Tracking', 'Bi-Weekly Strategic Syncs'] },
            { _id: 'pm-2', planName: 'Performance Partnership', monthlyPrice: 3000, oneTimePrice: 30000, isPopular: true, badge: 'Most Selected', description: 'Aligned Incentives', features: ['Everything in Growth Retainer', 'Predictive LTV Modeling', 'Proprietary Bid Algorithms', 'Custom Content Production'] },
            { _id: 'pm-3', planName: 'Enterprise Scale', monthlyPrice: 'Custom', oneTimePrice: 'Custom', isPopular: false, badge: '', description: 'Ecosystem Transformation', features: ['Data Clean Room Architecture', 'Server-side API Engineering', 'Incrementality Testing', 'Dedicated VP of Growth'] }
          ],
          'SEO Dominance': [
            { _id: 'seo-1', planName: 'Technical SEO Audit', monthlyPrice: 2500, oneTimePrice: 25000, isPopular: false, badge: '', description: 'Foundation Building', features: ['Deep Technical Audit', 'Site Architecture Revamp', 'Core Web Vitals Optimization', 'Keyword Gap Analysis'] },
            { _id: 'seo-2', planName: 'Organic Growth', monthlyPrice: 4500, oneTimePrice: 45000, isPopular: true, badge: 'High ROI', description: 'Market Capture', features: ['Everything in Technical', '4x Editorial Assets/mo', 'High-Authority Link Building', 'Digital PR Placements'] }
          ],
          'Creative Studio': [
            { _id: 'cs-1', planName: 'Ad Creative Matrix', monthlyPrice: 3500, oneTimePrice: 35000, isPopular: true, badge: 'Best Value', description: 'High-Velocity Testing', features: ['10 Net-New Video Assets/mo', '20 Static Variations', 'UGC Sourcing & Editing', 'Psychographic Copywriting'] }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    // Advanced Live Rates Fetcher (Using your utility)
    const initLiveRates = async () => {
      try {
        const ratesData = await getLiveRates();
        
        if (ratesData) {
          setExchangeRates(ratesData);
          // Extract all keys (currency codes)
          const currencies = Object.keys(ratesData);
          // Sort alphabetically, but pin priorities at the top
          const topPriority = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'AUD', 'CAD', 'SGD', 'KWD', 'NZD'];
          const sortedCurrencies = [
            ...topPriority.filter(c => currencies.includes(c)), // Ensure priority exists in fetched data
            ...currencies.filter(c => !topPriority.includes(c)).sort()
          ];
          setAvailableCurrencies(sortedCurrencies);
        }
      } catch (error) {
        console.error("Currency utility failed, using local static fallbacks.", error);
        setExchangeRates({ USD: 1, INR: 83.5, GBP: 0.79, AED: 3.67, EUR: 0.92 });
      }
    };
    
    fetchPricing();
    initLiveRates();
  }, []);

  const formatPrice = (price) => {
    if (!price || price === 'Custom' || String(price).toLowerCase() === 'custom') return "Custom"; 

    const rawNumber = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
    if (isNaN(rawNumber)) return price;

    const rates = exchangeRates || { USD: 1, INR: 83.5, GBP: 0.79, AED: 3.67, EUR: 0.92 };
    
    // Assuming base prices in backend are in USD
    const targetRate = rates[currency] || 1;
    const convertedAmount = rawNumber * targetRate;

    // Use Indian locale for commas if INR, otherwise US format
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency', 
        currency: currency, 
        maximumFractionDigits: 0
      }).format(convertedAmount);
    } catch (e) {
      // Fallback if browser doesn't support specific currency symbol
      return `${currency} ${convertedAmount.toFixed(0)}`;
    }
  };

  const activePlans = sanityPlans[activeService] || [];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap');
        .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        
        /* 3D Container Perspective */
        .perspective-1000 { perspective: 1000px; }
      `}} />

      <main className="bg-[#F9FAFB] min-h-screen font-body text-[#0F172A] selection:bg-[#0F172A] selection:text-white relative overflow-hidden pb-0">
        
        {/* Subtle Grain Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

        {/* Blurred Gradient Orbs */}
        <div className="absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9A227]/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[30%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none z-0" />

        {/* HERO SECTION */}
        <section className="relative pt-40 pb-16 md:pt-48 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgb(15,23,42,0.04)] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#0F172A]">Investment Models</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.95] text-[#0F172A] mb-8 uppercase">
              We price for <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #0F172A' }}>Impact.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-body text-[#6B7280] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              We do not bill for hours or sell generic packages. We build elite mathematical infrastructures designed to capture global market share and compound your revenue.
            </motion.p>
          </motion.div>
        </section>

        {/* DYNAMIC CONTROLS WITH 3D EFFECT */}
        <section className="px-6 pb-16 max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: premiumEase }} className="flex flex-col items-center gap-10">
            {/* 3D Animated Tabs */}
            <div className="flex flex-wrap justify-center bg-[#F3F4F6] border border-[#E5E7EB] p-1.5 rounded-full w-max mx-auto shadow-inner overflow-hidden">
              {services.map((service, index) => {
                const isActive = activeService === service.title;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveService(service.title)} 
                    className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm font-bold transition-all duration-500 z-10 ${isActive ? 'text-[#0F172A]' : 'text-[#6B7280] hover:text-[#0F172A]'}`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute inset-0 bg-white rounded-full border border-[#E5E7EB] -z-10" 
                        style={{ boxShadow: '0 8px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }} 
                      />
                    )}
                    <span className={`transition-colors duration-300 ${isActive ? 'text-[#C9A227]' : ''}`}>{service.icon}</span> 
                    {service.title}
                  </button>
                );
              })}
            </div>

            {/* Premium Switch & Dynamic Currency Dropdown */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              
              {/* Dark UI Switch Toggle */}
              <div className="flex items-center gap-4">
                <span 
                  onClick={() => setIsMonthly(true)}
                  className={`cursor-pointer font-body font-bold text-sm transition-colors duration-300 ${isMonthly ? 'text-[#0F172A]' : 'text-[#6B7280]'}`}
                >
                  Monthly Retainer
                </span>

                <button
                  onClick={() => setIsMonthly(!isMonthly)}
                  className="w-[3.25rem] h-8 bg-[#0F172A] rounded-full p-1 flex items-center cursor-pointer transition-colors shadow-inner focus:outline-none"
                  aria-label="Toggle Billing Cycle"
                >
                  <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ x: isMonthly ? 0 : 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>

                <span 
                  onClick={() => setIsMonthly(false)}
                  className={`cursor-pointer font-body font-bold text-sm transition-colors duration-300 flex items-center gap-2 ${!isMonthly ? 'text-[#0F172A]' : 'text-[#6B7280]'}`}
                >
                  6-Month Commitment
                  <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest transition-colors duration-300 ${!isMonthly ? 'bg-[#C9A227] text-white shadow-[0_2px_4px_rgba(201,162,39,0.3)]' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                    Save 20%
                  </span>
                </span>
              </div>

              {/* Dynamic Currency Dropdown */}
              <div className="relative group">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)} 
                  className="appearance-none bg-white border border-[#E5E7EB] text-[#0F172A] text-sm font-bold rounded-full pl-6 pr-12 py-3 focus:outline-none focus:border-[#C9A227] cursor-pointer shadow-sm hover:shadow-md transition-shadow min-w-[120px]"
                >
                  {availableCurrencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* PRICING GRID WITH 3D TILT EFFECT */}
        <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl mx-auto relative z-10 perspective-1000">
          {loading && Object.keys(sanityPlans).length === 0 ? (
            <div className="flex justify-center items-center py-20">
               <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#C9A227] animate-spin"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeService + isMonthly + currency} 
                initial={{ opacity: 0, rotateX: 5, y: 20 }} 
                animate={{ opacity: 1, rotateX: 0, y: 0 }} 
                exit={{ opacity: 0, rotateX: -5, y: -20 }} 
                transition={{ duration: 0.6, ease: premiumEase }} 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end justify-center"
              >
                {activePlans.map((plan, idx) => {
                  const isCustom = plan.monthlyPrice === 'Custom';
                  return (
                    <motion.div 
                      key={plan._id}
                      whileHover={{ 
                        y: -15, 
                        rotateY: idx === 0 ? 3 : idx === 2 ? -3 : 0, 
                        rotateX: 2,
                        transition: { duration: 0.4, ease: "easeOut" } 
                      }}
                      className={`relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border transition-all duration-700 ease-[0.16,1,0.3,1] group/card ${plan.isPopular ? 'bg-[#0F172A] border-[#0F172A] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] md:-translate-y-4 z-10 text-white' : 'bg-white border-[#E5E7EB] text-[#0F172A] shadow-[0_10px_30px_rgba(0,0,0,0.02)]'}`}
                    >
                      {plan.isPopular && <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 blur-[60px] rounded-full pointer-events-none group-hover/card:bg-[#C9A227]/15 transition-colors duration-500" />}
                      {plan.badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><span className="bg-[#C9A227] text-[#0F172A] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5 border border-[#C9A227]/20"><span className="w-1.5 h-1.5 rounded-full bg-[#0F172A] animate-pulse" /> {plan.badge}</span></div>}
                      
                      <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${plan.isPopular ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Phase 0{idx + 1} // {plan.description}</p>
                      <h3 className="font-heading text-3xl font-black mb-8 tracking-tight">{plan.planName}</h3>
                      
                      <div className={`mb-10 flex items-baseline border-b pb-8 ${plan.isPopular ? 'border-white/10' : 'border-[#F3F4F6]'}`}>
                        <span className="text-5xl font-heading font-black tracking-tighter">{formatPrice(isMonthly ? plan.monthlyPrice : plan.oneTimePrice)}</span>
                        {!isCustom && <span className={`text-xs font-bold uppercase tracking-widest ml-2 ${plan.isPopular ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{isMonthly ? '/ Mo' : '/ 6-Mo'}</span>}
                      </div>

                      <ul className="flex-1 space-y-4 mb-10">
                        {plan.features?.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-4">
                            <div className={`mt-0.5 rounded-full p-1 transition-transform group-hover/card:scale-110 ${plan.isPopular ? 'bg-[#C9A227]/20 text-[#C9A227]' : 'bg-[#0F172A]/5 text-[#0F172A]'}`}><Check size={14} strokeWidth={3} /></div>
                            <span className={`text-sm font-medium ${plan.isPopular ? 'text-[#F3F4F6]' : 'text-[#374151]'}`}>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <a href="/contact" className={`w-full py-4 rounded-full font-heading font-bold uppercase tracking-widest transition-all duration-500 text-[11px] flex justify-center items-center gap-2 group/btn ${plan.isPopular ? 'bg-[#C9A227] text-[#0F172A] hover:bg-white hover:scale-[1.02] shadow-lg' : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#0F172A] hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] hover:scale-[1.02]'}`}>
                        {isCustom ? "Talk to Partners" : "Initiate Protocol"} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        {/* INFRASTRUCTURE SECTION */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 w-full bg-white border-y border-[#E5E7EB] relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-24 relative z-10">
            <div className="md:w-1/3"><div className="sticky top-40">
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-4 block">Standard Protocol</span>
              <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tighter text-[#0F172A] mb-6 leading-[1.1]">The Baseline Infrastructure.</h2>
              <p className="font-body text-[#6B7280] text-lg">Every partnership includes full access to our proprietary technology stack and senior strategists. We do not upsell essentials.</p>
            </div></div>
            <div className="md:w-2/3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {[
                { title: "Senior Strategist", desc: "Managed by veteran operators with 10+ years of high-scale experience." },
                { title: "Server-Side Tracking", desc: "CAPI implementation to bypass iOS restrictions and cookie degradation." },
                { title: "Custom BI Dashboard", desc: "Real-time visualization of ROAS, blended CAC, and predictive LTV." },
                { title: "Creative Matrix", desc: "Continuous ideation and scripting of performance-driven video assets." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#C9A227] flex items-center justify-center mb-6 shadow-sm"><ShieldCheck size={20} /></div>
                  <h4 className="font-heading text-xl font-bold text-[#0F172A] mb-3">{item.title}</h4>
                  <p className="font-body text-[#6B7280] text-sm">{item.desc}</p>
                </div>
              ))}
            </div></div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-4 block">Transparency</motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#0F172A] mb-6">
              Frequently Asked <br /> Questions.
            </motion.h2>
          </motion.div>

          <div className="border-t border-[#E5E7EB]">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: premiumEase }}
                className="border-b border-[#E5E7EB]"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full py-8 flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="font-heading text-lg md:text-xl font-bold text-[#0F172A] group-hover:text-[#C9A227] transition-colors pr-8">
                    {faq.q}
                  </span>
                  <div className={`shrink-0 w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center transition-all duration-500 ${openFaq === index ? 'bg-[#0F172A] border-[#0F172A] text-white rotate-180 shadow-lg' : 'bg-transparent text-[#0F172A] group-hover:border-[#0F172A]'}`}>
                    {openFaq === index ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: premiumEase }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 font-body text-[#6B7280] text-lg leading-relaxed max-w-3xl pr-12">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="mt-12 bg-[#0F172A] rounded-t-[3rem] py-20 md:py-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden z-10 mx-4 sm:mx-6 max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-3rem)] lg:max-w-7xl lg:mx-auto mb-12">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#C9A227] rounded-full blur-[180px] opacity-[0.15] pointer-events-none mix-blend-screen" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-10 text-white text-left">
            <div className="md:w-2/3 lg:w-3/4">
              <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#C9A227] mb-6 block">Determine Growth Potential</span>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">Ready to <br /> Scale?</h2>
              <p className="font-body text-[#9CA3AF] text-lg max-w-2xl">Schedule a discovery call. We will analyze your current data stack, media efficiency, and scaling capability with radical transparency.</p>
            </div>
            <div className="md:w-1/3 flex justify-start md:justify-end">
              <a href="/contact" className="group relative overflow-hidden bg-white text-[#0F172A] px-10 py-5 rounded-full font-heading font-bold text-lg flex items-center gap-4 shadow-2xl hover:shadow-white/10 transition-all">
                <div className="absolute inset-0 bg-[#C9A227] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0" />
                <span className="relative z-10 group-hover:text-white">Schedule Audit</span>
                <div className="relative z-10 w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
                   <ArrowUpRight size={16} className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 delay-75" />
                   <ArrowUpRight size={16} className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500" />
                </div>
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}