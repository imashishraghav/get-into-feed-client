import React from "react";
import { client } from "@/sanity/lib/client";

// ==========================================================================
// 1. IMPORT ALL PREMIUM COMPONENTS
// ==========================================================================
import WorkWithUsHero from "@/components/work/WorkWithUsHero";
import WhoItsFor from "@/components/work/WhoItsFor";
import WhoNotFor from "@/components/work/WhoNotFor";
import ValueSection from "@/components/work/ValueSection";
import PricingExpectation from "@/components/work/PricingExpectation";
import Process from "@/components/work/Process";
import Proof from "@/components/work/Proof";
import FinalCTA from "@/components/work/FinalCTA"; 
import JobOpenings from "@/components/work/JobOpenings";

// ==========================================
// ⚡ ISR: AUTO-UPDATE EVERY 60 SECONDS
// ==========================================
export const revalidate = 60;

// ==========================================================================
// 2. PAGE SPECIFIC SEO METADATA
// ==========================================================================
export const metadata = {
  title: "Work With Us | Get Into Feed",
  description: "Apply to partner with Get Into Feed or join our elite team. We build scalable, high-ROI marketing systems.",
  openGraph: {
    title: "Work With Us | Get Into Feed",
    description: "Ready to scale? Apply to build a predictable growth system or join our team.",
    url: 'https://www.getintofeed.com/careers', 
  }
};

// ==========================================================================
// 3. MAIN PAGE LAYOUT (Now an Async Server Component)
// ==========================================================================
export default async function WorkWithUsPage() {
  
  // 🎯 GROQ Query: Fetch ONLY Active Jobs
  const query = `*[_type == "job" && isActive == true] | order(_createdAt desc){
    role,
    "slug": slug.current,
    department,
    location,
    type,
    experience,
    shortDescription
  }`;

  // 🔌 Fetch data safely from Sanity CMS
  const jobs = await client.fetch(query).catch(() => []);

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F8F9FB] selection:bg-[#2ED1B2]/20 selection:text-[#0F172A]">
      
      {/* 1. The Hook: Introduce the offer and build excitement */}
      <WorkWithUsHero />

      {/* 2. The Filter: Psychologically qualify the user */}
      <WhoItsFor />
      
      {/* 3. The Anti-Filter: Build authority by showing who we reject */}
      <WhoNotFor />

      {/* 4. The Offer: Show outcomes instead of basic services */}
      <ValueSection />

      {/* 5. The Qualifier: Filter out low-budget clients immediately */}
      <PricingExpectation />

      {/* 6. The Roadmap: Reduce anxiety by showing exactly what happens next */}
      <Process />

      {/* 7. The Proof: Final trust builder before the application */}
      <Proof />

      {/* 8. The Action: Dynamic Job Openings (Replaced the static form) */}
      <JobOpenings jobs={jobs} />

      {/* 9. The Closing: Final exclusive push for users who scrolled past */}
      <FinalCTA />

    </main>
  );
}
