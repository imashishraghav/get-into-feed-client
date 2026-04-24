import { client } from "@/sanity/lib/client";
import ServiceBreakdownClient from "./ServiceBreakdownClient";

export default async function ServiceBreakdown() {
  // 🎯 SANITY GROQ QUERY
  const query = `*[_type == "service"] | order(order asc){
    title,
    "slug": slug.current,
    shortDescription,
    tagline,
    "icon": icon.asset->url
  }`;

  // 🔄 FETCH DATA
  const services = await client.fetch(query);

  if (!services || services.length === 0) {
    return null; 
  }

  // 🚀 PASS DYNAMIC DATA TO YOUR UI
  return (
    <section className="bg-[#F8F9FB] py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Soft Gradients for Light Theme */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2ED1B2]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <ServiceBreakdownClient services={services} />
      </div>
    </section>
  );
}