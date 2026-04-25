import React from "react";
import { client } from "@/sanity/lib/client";

// 🟢 Components Imports (Ensure folder names match exactly)
import CaseStudiesHero from "@/components/Case Studies/CaseStudiesHero";
import QuickProof from "@/components/Case Studies/QuickProof";
import CaseStudiesGrid from "@/components/Case Studies/CaseStudiesGrid";

// ============================================================================
// 🟢 Next.js SEO Metadata
// ============================================================================
export const metadata = {
  title: "Our Work & Case Studies | Get Into Feed",
  description: "See how we help brands generate high-intent leads, scale revenue, and build predictable growth systems.",
  openGraph: {
    title: "Real Results. Real Growth. | Get Into Feed",
    description: "Explore our case studies and see the exact systems we use to dominate the market.",
    type: "website",
  },
};

// ============================================================================
// 🟢 MAIN SERVER COMPONENT
// ============================================================================
export default async function CaseStudiesPage() {
  
  // 🔌 1. Fetch all case studies from Sanity CMS
  const query = `*[_type == "caseStudy"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    industry,
    problem,
    result,
    shortDescription,
    "imageUrl": image.asset->url,
    icon
  }`;

  // 🔌 2. Fetch with fallback empty array to prevent build crashes
  const caseStudiesData = await client.fetch(query).catch(() => []);

  // 🚀 3. Render the Page Flow
  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      
      {/* 1. The Opening: High-Impact Parallax Hero */}
      <CaseStudiesHero />
      
      {/* 2. The Hook: Bold Metrics Proof (Stats) */}
      <QuickProof />
      
      {/* 3. The Evidence: Dynamic Sanity Case Studies Grid */}
      {/* 🟢 Passing the fetched Sanity data directly to the Grid component */}
      <CaseStudiesGrid caseStudies={caseStudiesData} />

    </main>
  );
}
