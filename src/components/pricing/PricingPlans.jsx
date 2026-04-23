// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";

/* // ============================================================================
// 🔌 SANITY CMS USAGE (In your app/pricing/page.jsx):
// ============================================================================
// import { client } from "@/sanity/lib/client";
// import PricingPlans from "@/components/pricing/PricingPlans";
//
// export default async function PricingPage() {
//   const query = `*[_type == "pricing"] | order(order asc) {
//     planName, description, monthlyPrice, oneTimePrice, features, isPopular, badge
//   }`;
//   const plans = await client.fetch(query).catch(() => []);
//   
//   return (
//     <main>
//       <PricingHero />
//       <PricingExplanation />
//       <PricingPlans plans={plans} />
//     </main>
//   );
// }
// ============================================================================ */

// ----------------------------------------------------------------------
// Fallback Data (Matches your precise brief)
// ----------------------------------------------------------------------
const fallbackPlans = [
  {
    planName: 'Starter — "Launch & Foundation"',
    description: "For businesses starting their growth journey.",
    monthlyPrice: "Starting from ₹29,999/month",
    isPopular: false,
    features: [
      { featureName: "Launch growth system", isIncluded: true },
      { featureName: "Lead generation setup", isIncluded: true },
      { featureName: "Basic ad campaigns", isIncluded: true },
      { featureName: "Creative support", isIncluded: true }
    ],
    ctaText: "Get Started"
  },
  {
    planName: 'Growth — "Scale & Optimize"',
    description: "For businesses ready to scale consistently.",
    monthlyPrice: "Starting from ₹59,999/month",
    isPopular: true,
    badge: "MOST POPULAR",
    features: [
      { featureName: "Consistent lead generation", isIncluded: true, isHighlighted: true },
      { featureName: "Campaign scaling", isIncluded: true },
      { featureName: "Conversion optimization", isIncluded: true },
      { featureName: "Advanced creatives", isIncluded: true }
    ],
    ctaText: "Book Strategy Call"
  },
  {
    planName: 'Scale — "Dominate & Expand"',
    description: "For brands ready to dominate their market.",
    monthlyPrice: "Custom Pricing",
    isPopular: false,
    features: [
      { featureName: "Full-funnel system", isIncluded: true },
      { featureName: "Multi-channel scaling", isIncluded: true },
      { featureName: "Landing pages", isIncluded: true },
      { featureName: "Influencer expansion", isIncluded: true }
    ],
    ctaText: "Book Consultation"
  }
];

// ----------------------------------------------------------------------
// Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 28 } 
  },
};

export default function PricingPlans({ plans = [] }) {
  // Use Sanity data if available, otherwise use fallback
  const displayPlans = plans?.length > 0 ? plans : fallbackPlans;

  return (
    <section className="relative w-full bg-background py-20 md:py-32 selection:bg-primary/20 selection:text-secondary transform-gpu">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-10 items-center transform-gpu"
        >
          {displayPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Pricing Card Component
// ----------------------------------------------------------------------
function PricingCard({ plan }) {
  const isPremium = plan.isPopular;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative flex flex-col h-full bg-white rounded-3xl p-8 lg:p-10 transition-all duration-500 ease-out transform-gpu 
        ${isPremium 
          ? "border-2 border-primary shadow-[0_30px_60px_-15px_rgba(46,209,178,0.25)] lg:scale-105 z-20" 
          : "border border-navy/10 shadow-sm hover:shadow-xl hover:border-primary/40 z-10"
        }`}
    >
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-navy px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-1.5 shadow-lg shadow-primary/20">
          <Star className="w-3.5 h-3.5 fill-navy" />
          {plan.badge || "MOST POPULAR"}
        </div>
      )}

      {/* 1. Header Area */}
      <div className="mb-8">
        <h3 className="font-heading text-xl lg:text-2xl font-extrabold text-navy mb-3 leading-tight">
          {plan.planName}
        </h3>
        <p className="font-sans text-[15px] text-navy/70 font-medium leading-relaxed min-h-[44px]">
          {plan.description}
        </p>
      </div>

      {/* 2. Price Area */}
      <div className="mb-8 pb-8 border-b border-navy/10">
        <div className="flex items-baseline gap-1">
          {/* Handles "Custom Pricing" cleanly without showing '/month' */}
          <span className={`font-heading font-extrabold tracking-tight text-navy ${plan.monthlyPrice.toLowerCase().includes('custom') ? 'text-3xl' : 'text-3xl md:text-4xl'}`}>
            {plan.monthlyPrice}
          </span>
        </div>
        {plan.oneTimePrice && (
          <p className="font-sans text-sm text-navy/50 font-medium mt-2">
            + {plan.oneTimePrice} setup fee
          </p>
        )}
      </div>

      {/* 3. Features List */}
      <div className="flex-1 mb-10">
        <p className="text-[13px] font-bold text-navy uppercase tracking-wider mb-6">
          What's Included
        </p>
        <ul className="flex flex-col gap-5">
          {plan.features?.map((feature, i) => {
            // Safely handle both string arrays and the advanced object schema
            const featureName = feature.featureName || feature;
            const isHighlighted = feature.isHighlighted || false;
            const isIncluded = feature.isIncluded !== false; // defaults to true

            return (
              <li key={i} className={`flex items-start gap-3 ${!isIncluded && "opacity-40"}`}>
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isIncluded ? "text-primary" : "text-slate-300"}`} />
                <span className={`font-sans text-[15px] leading-snug ${isHighlighted ? "font-bold text-navy" : "font-medium text-navy/70"}`}>
                  {featureName}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 4. Call to Action Button */}
      <Link href="/contact" className="mt-auto block w-full focus:outline-none">
        <motion.button
          whileTap={{ scale: 0.96 }}
          className={`w-full py-4 rounded-xl font-bold font-heading text-base transition-all duration-300 flex justify-center items-center gap-2 transform-gpu 
            ${isPremium 
              ? "bg-primary text-navy shadow-lg shadow-primary/20 hover:bg-primary/90" 
              : "bg-navy text-white hover:bg-navy/90"
            }`}
        >
          {plan.ctaText || "Apply Now"}
        </motion.button>
      </Link>
    </motion.div>
  );
}