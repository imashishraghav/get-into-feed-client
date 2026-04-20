import React from "react";
import { client } from "@/sanity/lib/client";

// 🟢 Import the Client Wrapper
import CaseStudyClient from "@/components/Case Studies/CaseStudyClient";

// 🟢 Dynamic SEO Metadata based on the specific case study
export async function generateMetadata({ params }) {
  const query = `*[_type == "caseStudy" && slug.current == $slug][0]{ title, shortDescription }`;
  const caseStudy = await client.fetch(query, { slug: params.slug }).catch(() => null);
  
  return {
    title: `${caseStudy?.title || 'Case Study'} | Get Into Feed`,
    description: caseStudy?.shortDescription || 'Discover how we drive predictable growth.',
  };
}

export default async function SingleCaseStudyPage({ params }) {
  // 🔌 Fetch the full detailed data for the specific case study
  const query = `*[_type == "caseStudy" && slug.current == $slug][0]{
    title,
    industry,
    clientName,
    overview,
    problem,
    strategy,
    execution,
    results,
    testimonial,
    images,
    conclusion
  }`;
  
  const caseStudyData = await client.fetch(query, { slug: params.slug }).catch(() => null);

  // 404 Fallback if the URL slug doesn't match any project in Sanity
  if (!caseStudyData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FB] text-[#0F172A] font-bold text-2xl">
        Case Study not found.
      </div>
    );
  }

  // Yahan hum data fetch karke <CaseStudyClient /> component ko de rahe hain
  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <CaseStudyClient data={caseStudyData} />
    </main>
  );
}