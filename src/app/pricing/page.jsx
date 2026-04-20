// ============================================================================
// 🟢 SANITY CLIENT IMPORT (Check your exact path, usually it's this one)
// ============================================================================
import { client } from "@/sanity/lib/client"; 

// ============================================================================
// 🟢 PREMIUM COMPONENTS IMPORTS
// ============================================================================
import PricingHero from "@/components/pricing/PricingHero";
import PricingExplanation from "@/components/pricing/PricingExplanation";
import PricingPlans from "@/components/pricing/PricingPlans";
import Comparison from "@/components/pricing/Comparison";
import FAQ from "@/components/pricing/FAQ";
import FinalCTA from "@/components/pricing/FinalCTA";

// ============================================================================
// 🟢 SEO METADATA (Crucial for an Enterprise Agency)
// ============================================================================
export const metadata = {
  title: "Pricing & Plans | Get Into Feed",
  description: "Simple pricing. Real growth. Choose a plan designed to generate leads, scale revenue, and build a predictable growth system.",
  openGraph: {
    title: "Pricing & Plans | Get Into Feed",
    description: "Simple pricing. Real growth. Choose a plan designed to generate leads, scale revenue, and build a predictable growth system.",
    // images: ["/your-og-image-url.jpg"], // Uncomment and add your OG image path later
  },
};

// ============================================================================
// 🟢 MAIN PAGE COMPONENT (Server Component)
// ============================================================================
export default async function PricingPage() {
  
  // 1. GROQ Query to fetch all active plans, ordered by the 'order' field we set in schema
  const query = `*[_type == "pricing"] | order(order asc) {
    planName,
    description,
    monthlyPrice,
    oneTimePrice,
    features,
    isPopular,
    badge,
    ctaText,
    stripeMonthlyLink,
    fallbackLink
  }`;

  // 2. Fetch data from Sanity. 
  // We use .catch() so if Sanity isn't setup yet, it doesn't crash the page 
  // and instead uses the fallback data we coded inside <PricingPlans />
  const plans = await client.fetch(query).catch((err) => {
    console.error("Sanity Fetch Error:", err);
    return [];
  });

  // 3. Render the Page Flow
  return (
    <main className="flex flex-col min-h-screen w-full bg-[#F8F9FB] overflow-hidden">
      
      {/* 1. The Entry & Mindset Shift */}
      <PricingHero />
      
      {/* 2. Logic & Justification */}
      <PricingExplanation />
      
      {/* 3. The Core Offer (Dynamic Data Passed Here) */}
      <PricingPlans plans={plans} />
      
      {/* 4. Objection Handling & Differentiation */}
      <Comparison />
      
      {/* 5. Final Doubts Cleared */}
      <FAQ />
      
      {/* 6. The Conversion Action */}
      <FinalCTA />

    </main>
  );
}