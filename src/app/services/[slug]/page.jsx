import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import ServiceClient from '@/app/services/ServiceClient';

// ==========================================
// ⚡ ISR: REAL-TIME UPDATE SYSTEM (60s)
// ==========================================
export const revalidate = 60;

// ==========================================
// 1. STATIC GENERATION (SSG)
// ==========================================
export async function generateStaticParams() {
  const query = `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`;
  const slugs = await client.fetch(query);
  return slugs.map((service) => ({ slug: service.slug }));
}

// ==========================================
// 2. DYNAMIC SEO METADATA
// ==========================================
export async function generateMetadata({ params }) {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    seoTitle,
    seoDescription,
    title,
    tagline,
    "image": coverImage.asset->url
  }`;
  
  const service = await client.fetch(query, { slug: params.slug });

  if (!service) return {};

  return {
    title: service.seoTitle || `${service.title} | Get Into Feed`,
    description: service.seoDescription || service.tagline,
    openGraph: {
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.tagline,
      images: service.image ? [{ url: service.image }] : [],
      type: 'website',
    },
  };
}

// ==========================================
// 3. MAIN SERVER COMPONENT
// ==========================================
export default async function ServicePage({ params }) {
  // 🎯 CRITICAL: SANITY GROQ QUERY FOR SINGLE SERVICE
  const query = `*[_type == "service" && slug.current == $slug][0]{
    title,
    tagline,
    content,
    deliverables[],
    faqs[],
    "image": coverImage.asset->url,
    seoTitle,
    seoDescription
  }`;

  const data = await client.fetch(query, { slug: params.slug });

  // 🚫 ERROR HANDLING
  if (!data) notFound();

  // 🚀 PASS DATA TO YOUR PREMIUM UI COMPONENT
  // Note: Aap apne ServiceClient mein Sticky CTA implement kar sakte hain
  return (
    <main className="bg-[#F8F9FB] min-h-screen relative selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <ServiceClient data={data} />
    </main>
  );
}