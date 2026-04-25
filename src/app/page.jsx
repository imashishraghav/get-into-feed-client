import { client } from '../sanity/lib/client';

import Hero from '../components/homepage/Hero';
import TrustBar from '../components/homepage/TrustBar';
import PainSection from '../components/homepage/PainSection';
import Capabilities from '../components/homepage/Capabilities';
import UniqueSystem from '../components/homepage/UniqueSystem';
import CaseStudies from '../components/homepage/CaseStudies';
import Comparison from '../components/homepage/Comparison';
import Pricing from '../components/homepage/Pricing';
import Testimonials from '../components/homepage/Testimonials';
import LeadMagnet from '../components/homepage/LeadMagnet';
import FAQ from '../components/homepage/FAQ';
import CTA from '../components/homepage/CTA';

// ----------------------------------------------------------------------
// GROQ Queries
// ----------------------------------------------------------------------
const servicesQuery = `*[_type == "service"] | order(order asc) {
  _id,
  title,
  shortDescription,
  slug,
  "icon": icon.asset->url
}`;

const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  name,
  role,
  company,
  feedback,
  "imageUrl": image.asset->url,
  rating,
  featured
}`;

// Enterprise Pricing Query
const pricingQuery = `*[_type == "pricing"] | order(order asc) {
  _id,
  planName,
  description,
  monthlyPrice,
  yearlyPrice,
  yearlyDiscountBadge,
  disclaimerText,
  features[]{
    featureName,
    isIncluded,
    isHighlighted,
    tooltip
  },
  isPopular,
  badge,
  ctaText,
  stripeMonthlyLink,
  stripeYearlyLink,
  fallbackLink
}`;

// 🟢 NEW: Top 2 Case Studies Query (Latest wale)
const caseStudiesQuery = `*[_type == "caseStudy"] | order(_createdAt desc)[0...2] {
  _id,
  "client": title,
  "slug": slug.current,
  industry,
  "description": shortDescription,
  metrics[] {
    prefix,
    value,
    suffix,
    label
  }
}`;

// ----------------------------------------------------------------------
// Next.js Cache Control
// Forces Next.js to check Sanity for fresh data every 10 seconds.
// ----------------------------------------------------------------------
export const revalidate = 10;

export default async function Home() {
  // 🟢 Fetch all the data on the server in parallel for optimal performance
  const [services, testimonials, pricingPlans, caseStudiesData] = await Promise.all([
    client.fetch(servicesQuery).catch(() => []),
    client.fetch(testimonialsQuery).catch(() => []),
    client.fetch(pricingQuery).catch(() => []),
    client.fetch(caseStudiesQuery).catch(() => []) // 🟢 Fetched Case Studies
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0F172A] font-sans selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] overflow-x-clip relative">
      <Hero />
      <TrustBar />
      <PainSection />
      <Capabilities services={services} />
      <UniqueSystem />      
      
      {/* 🟢 Inject Sanity Data into CaseStudies */}
      <CaseStudies caseStudiesData={caseStudiesData} />
      
      <Testimonials testimonials={testimonials} />      
      <Comparison />
      <Pricing plans={pricingPlans} />
      <LeadMagnet />
      <FAQ />
      <CTA />
    </div>
  );
}
