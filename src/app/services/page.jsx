import React from "react";
import { client } from "@/sanity/lib/client";

import ServicesHero from "@/components/services/ServicesHero";
import ServicesOverview from "@/components/services/ServicesOverview";
import SystemSection from "@/components/services/SystemSection";
import ServiceBreakdown from "@/components/services/ServiceBreakdown";
import OutcomesSection from "@/components/services/OutcomesSection";
import ProofSection from "@/components/services/ProofSection";
import TestimonialsSection from "@/components/services/TestimonialsSection";
import WhoItsFor from "@/components/services/WhoItsFor";
import FinalCTA from "@/components/services/FinalCTA";

// ----------------------------------------------------------------------
// 🔌 Sanity Data Fetching Logic (Parallel Fetching for Max Speed)
// ----------------------------------------------------------------------
async function getServicesPageData() {
  
  // 🟢 MAIN FIX: Schema ke hisaab se exact 'feedback' field mangwayi hai
  // Aur usko 'testimonial' naam de diya taaki frontend component crash na kare.
  const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc) {
    _id, 
    name, 
    role, 
    company, 
    "testimonial": feedback, 
    "imageUrl": image.asset->url,
    isFeatured
  }`;

  const servicesQuery = `*[_type == "service"] | order(order asc){ 
    title, 
    "slug": slug.current, 
    shortDescription, 
    tagline, 
    "icon": icon.asset->url 
  }`;

  const [testimonials, servicesData] = await Promise.all([
    client.fetch(testimonialsQuery).catch(() => []),
    client.fetch(servicesQuery).catch(() => []), 
  ]);

  return { testimonials, servicesData };
}

// ----------------------------------------------------------------------
// 🟢 Next.js SEO Metadata
// ----------------------------------------------------------------------
export const metadata = {
  title: "Our Services | Get Into Feed - Elite Marketing Systems", 
  description: "We combine performance marketing, creative strategy, and data-driven execution to build complete growth systems that scale your revenue predictably.",
  openGraph: {
    title: "Growth Services Built to Scale Your Revenue",
    description: "Discover our unified growth systems designed to generate leads, lower CPA, and dominate your market.",
    images: [{ url: '/og-services.png', width: 1200, height: 630 }],
    type: "website",
  },
};

export default async function ServicesPage() {
  const { testimonials, servicesData } = await getServicesPageData();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <ServicesHero />
      <ServicesOverview services={servicesData} />
      <SystemSection />
      <ServiceBreakdown />
      <OutcomesSection />
      <ProofSection />
      <TestimonialsSection testimonials={testimonials} />
      <WhoItsFor />
      <FinalCTA />
    </main>
  );
}