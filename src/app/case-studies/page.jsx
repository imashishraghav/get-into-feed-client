import React from "react";
import { client } from "@/sanity/lib/client";

// 🟢 Update these 3 lines at the top of your page.jsx
import CaseStudiesHero from "@/components/Case Studies/CaseStudiesHero";
import QuickProof from "@/components/Case Studies/QuickProof";
import CaseStudiesGrid from "@/components/Case Studies/CaseStudiesGrid";

// 🟢 Next.js SEO Metadata
export const metadata = {
  title: "Our Work & Case Studies | Get Into Feed",
  description: "See how we help brands generate high-intent leads, scale revenue, and build predictable growth systems.",
  openGraph: {
    title: "Real Results. Real Growth. | Get Into Feed",
    description: "Explore our case studies and see the exact systems we use to dominate the market.",
    type: "website",
  },
};

export default async function CaseStudiesPage() {
  // 🔌 Fetch all case studies from Sanity CMS
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

  // Fetch with fallback empty array to prevent build crashes if Sanity is empty
  const caseStudies = await client.fetch(query).catch(() => []);

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      
      {/* 1. The Opening: High-Impact Parallax Hero */}
      <CaseStudiesHero />
      
      {/* 2. The Hook: Bold Metrics Proof (Stats) */}
      <QuickProof />
      
      {/* 3. The Evidence: Dynamic Sanity Case Studies Grid */}
      <CaseStudiesGrid caseStudies={caseStudies} />

    </main>
  );
}