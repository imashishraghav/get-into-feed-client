import React from "react";

// ==========================================================================
// 1. IMPORT ALL PREMIUM COMPONENTS
// ==========================================================================
// Note: Using the @ alias that we configured in jsconfig.json
import WorkWithUsHero from "@/components/work/WorkWithUsHero";
import WhoItsFor from "@/components/work/WhoItsFor";
import WhoNotFor from "@/components/work/WhoNotFor";
import ValueSection from "@/components/work/ValueSection";
import PricingExpectation from "@/components/work/PricingExpectation";
import Process from "@/components/work/Process";
import Proof from "@/components/work/Proof";
import WorkWithUsForm from "@/components/work/WorkWithUsForm";
import FinalCTA from "@/components/contact/FinalCTA"; // Path adjusted based on your image/previous prompt

// ==========================================================================
// 2. PAGE SPECIFIC SEO METADATA
// ==========================================================================
export const metadata = {
  title: "Work With Us",
  description: "Apply to partner with Get Into Feed. We build scalable, high-ROI marketing systems for businesses ready to dominate their market.",
  openGraph: {
    title: "Work With Us | Get Into Feed",
    description: "Ready to scale? Apply to build a predictable growth system.",
    url: 'https://www.getintofeed.com/careers', // Update with your actual URL
  }
};

// ==========================================================================
// 3. MAIN PAGE LAYOUT
// ==========================================================================
export default function WorkWithUsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F8F9FB]">
      
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

      {/* 8. The Action: Premium qualification form */}
      <WorkWithUsForm />

      {/* 9. The Closing: Final exclusive push for users who scrolled past the form */}
      <FinalCTA />

    </div>
  );
}