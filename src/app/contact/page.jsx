// ============================================================================
// 🟢 SANITY CLIENT IMPORT
// ============================================================================
import { client } from "@/sanity/lib/client";

// ============================================================================
// 🟢 PREMIUM COMPONENTS IMPORTS
// ============================================================================
import LetsTalkHero from "@/components/contact/LetsTalkHero";
import Trust from "@/components/contact/Trust";
import Process from "@/components/contact/Process";
import Qualification from "@/components/contact/Qualification";
import ContactForm from "@/components/contact/ContactForm";
import Testimonial from "@/components/contact/Testimonial";
import FinalCTA from "@/components/contact/FinalCTA"; 

// ==========================================
// ⚡ ISR: AUTO-UPDATE EVERY 60 SECONDS
// ==========================================
export const revalidate = 60;

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
// 🟢 MAIN PAGE COMPONENT (Async Server Component)
// ============================================================================
export default async function ContactPage() {
  
  // 🎯 GROQ Query 1: Fetch CTA Settings (if available)
  const ctaQuery = `*[_type == "ctaSettings"][0] {
    heading,
    highlight,
    subheading,
    buttonText,
    buttonLink,
    trustBadge
  }`;

  // 🎯 GROQ Query 2: Fetch one FEATURED Testimonial to show below the form
  const testimonialQuery = `*[_type == "testimonial" && featured == true][0] {
    name, 
    role, 
    company, 
    "testimonial": coalesce(quote, pt::text(testimonial), testimonial), 
    "imageUrl": image.asset->url
  }`;

  // 🔌 Fetch both datasets parallelly for maximum speed
  const [ctaData, testimonialData] = await Promise.all([
    client.fetch(ctaQuery).catch(() => null),
    client.fetch(testimonialQuery).catch(() => null)
  ]);

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
      
      {/* 6. The Final Micro-Proof (Now passing Sanity Data) */}
      {/* Make sure your Testimonial component accepts a 'data' prop like FinalCTA does */}
      <Testimonial data={testimonialData} />
      
      {/* 7. The Last Push (Scrolls back to form, now dynamic) */}
      <FinalCTA data={ctaData} />

    </main>
  );
}
