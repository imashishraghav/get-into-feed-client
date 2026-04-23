// @ts-nocheck
import React from "react";
import { client } from "@/sanity/lib/client";

// 🟢 Components Import
import AboutHero from "@/components/about/AboutHero";
import WhatWeDo from "@/components/about/WhatWeDo";
import Approach from "@/components/about/Approach";
import WhatMakesUsDifferent from "@/components/about/WhatMakesUsDifferent";
import ResultsSection from "@/components/about/ResultsSection";
import TestimonialsSection from "@/components/about/TestimonialsSection";
import Team from "@/components/about/Team"; // 🟢 Fixed: Reverted back to "Team"
import MissionVision from "@/components/about/MissionVision";
import FinalCTA from "@/components/about/FinalCTA";
import TrustBar from "@/components/homepage/TrustBar";

// ==========================================================================
// 🟢 SEO METADATA
// ==========================================================================
export const metadata = {
  title: "About Us | Get Into Feed",
  description: "We help brands move from inconsistent results to predictable growth by building structured, data-driven marketing systems.",
  openGraph: {
    title: "About Us | Get Into Feed",
    description: "Not your typical agency. We build systems that drive real business growth.",
  }
};

// ==========================================================================
// 🟢 DATA FETCHING (With Next.js ISR Caching)
// ==========================================================================
async function getAboutPageData() {
  const testimonialsQuery = `*[_type == "testimonial"] | order(order asc) {
    _id, name, role, company, feedback, rating, "imageUrl": image.asset->url, isFeatured
  }`;

  const fetchOptions = { next: { revalidate: 60 } }; 

  const testimonials = await client.fetch(testimonialsQuery, {}, fetchOptions).catch(() => []);

  return { testimonials };
}

// ==========================================================================
// 🟢 MAIN PAGE ASSEMBLY
// ==========================================================================
export default async function AboutPage() {
  const { testimonials } = await getAboutPageData();

  return (
    <main className="flex flex-col w-full min-h-screen bg-background selection:bg-primary/30 selection:text-navy">
      
      {/* 1. WHO */}
      <AboutHero />

      {/* 2. WHAT */}
      <WhatWeDo />

      {/* (Optional Micro-Trust: Partner Logos) */}
      <TrustBar />

      {/* 3. HOW */}
      <Approach />

      {/* 4. WHY */}
      <WhatMakesUsDifferent />

      {/* 5. PROOF */}
      {/* 🟢 Fixed: Removed the unused results prop */}
      <ResultsSection />

      {/* 6. TRUST */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 7. PEOPLE */}
      {/* 🟢 Fixed: Using <Team /> instead of TeamSection */}
      <Team /> 

      {/* 8. VISION */}
      <MissionVision />

      {/* 9. ACTION */}
      <FinalCTA />

    </main>
  );
}