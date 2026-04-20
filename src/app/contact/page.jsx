// ============================================================================
// 🟢 PREMIUM COMPONENTS IMPORTS
// Make sure these paths match where you saved your components
// ============================================================================
import LetsTalkHero from "@/components/contact/LetsTalkHero";
import Trust from "@/components/contact/Trust";
import Process from "@/components/contact/Process";
import Qualification from "@/components/contact/Qualification";
import ContactForm from "@/components/contact/ContactForm";
import Testimonial from "@/components/contact/Testimonial";
import FinalCTA from "@/components/contact/FinalCTA"; 

// ============================================================================
// 🟢 SEO METADATA (Crucial for Agency Credibility)
// ============================================================================
export const metadata = {
  title: "Let's Talk | Get Into Feed",
  description: "Ready to dominate the feed? Tell us about your business and we’ll help you generate leads, scale your campaigns, and build predictable growth.",
  openGraph: {
    title: "Let's Talk | Get Into Feed",
    description: "Ready to dominate the feed? Let’s build your growth system.",
    // images: ["/contact-og-image.jpg"], // Add your OG image path later
  },
};

// ============================================================================
// 🟢 MAIN PAGE COMPONENT (Server Component)
// ============================================================================
export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen w-full bg-[#F8F9FB] overflow-hidden scroll-smooth">
      
      {/* 1. The Welcome & Mindset Shift */}
      <LetsTalkHero />
      
      {/* 2. Dropping the Defense Mechanism */}
      <Trust />
      
      {/* 3. Setting Clear Expectations */}
      <Process />
      
      {/* 4. The Elite Filter (Who this is for/not for) */}
      <Qualification />
      
      {/* 5. The Core Conversion Engine */}
      <ContactForm />
      
      {/* 6. The Final Micro-Proof */}
      <Testimonial />
      
      {/* 7. The Last Push (Scrolls back to form) */}
      <FinalCTA />

    </main>
  );
}