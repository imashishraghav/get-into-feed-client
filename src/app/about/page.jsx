import React from "react";
import { client } from "@/sanity/lib/client";

// 🟢 Components Import
import AboutHero from "@/components/about/AboutHero";
import WhatWeDo from "@/components/about/WhatWeDo";
import Approach from "@/components/about/Approach";
import WhatMakesUsDifferent from "@/components/about/WhatMakesUsDifferent";
import ResultsSection from "@/components/about/ResultsSection";
import TestimonialsSection from "@/components/about/TestimonialsSection";
import Team from "@/components/about/Team"; 
import MissionVision from "@/components/about/MissionVision";
import FinalCTA from "@/components/about/FinalCTA";
import TrustBar from "@/components/homepage/TrustBar";

async function getAboutPageData() {
  const resultsQuery = `*[_type == "results"] | order(order asc) {
    _id, title, value, prefix, suffix, description
  }`;
  const testimonialsQuery = `*[_type == "testimonial"] | order(order asc) {
    _id, name, role, company, feedback, rating, "imageUrl": image.asset->url, isFeatured
  }`;

  const [results, testimonials] = await Promise.all([
    client.fetch(resultsQuery).catch(() => []), 
    client.fetch(testimonialsQuery).catch(() => []),
  ]);

  return { results, testimonials };
}

export default async function AboutPage() {
  const { results, testimonials } = await getAboutPageData();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      
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
      <ResultsSection results={results} />

      {/* 6. TRUST */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 7. PEOPLE */}
      <Team />

      {/* 8. VISION */}
      <MissionVision />

      {/* 9. ACTION */}
      <FinalCTA />

    </main>
  );
}