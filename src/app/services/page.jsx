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


async function getServicesPageData() {
  const testimonialsQuery = `*[_type == "testimonial"] | order(order asc) {
    _id, name, role, company, testimonial, 
    "imageUrl": image.asset->url,
    isFeatured
  }`;

  // Fetching data with a catch block to prevent build errors if schema is empty
  const [testimonials] = await Promise.all([
    client.fetch(testimonialsQuery).catch(() => []),
  ]);

  return { testimonials };
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
  // Fetch dynamic data from Sanity
  const { testimonials } = await getServicesPageData();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      
      {/* 1. The Opening: Premium Parallax Hero */}
      <ServicesHero />

      {/* 2. The Overview: Scannable Grid of all services */}
      <ServicesOverview />

      {/* 3. The Process: 4-Step Vertical/Horizontal Timeline */}
      <SystemSection />

      {/* 4. The Details: Deep dive into each service (Alternating Layout) */}
      <ServiceBreakdown />

      {/* 5. The Value: What results the client actually gets */}
      <OutcomesSection />

      {/* 6. The Hard Proof: Numbers and Case Snippets */}
      <ProofSection />

      {/* 7. The Human Proof: Client Quotes & Carousel */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 8. The Filter: Qualifying the right clients */}
      <WhoItsFor />

      {/* 9. The Conversion: High-Impact Magnetic CTA */}
      <FinalCTA />

    </main>
  );
}