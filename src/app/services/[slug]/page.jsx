import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';

// 🟢 Import our Premium UI Component
import ServiceDetailClient from '@/components/services/ServiceDetailClient';

// ==========================================
// ⚡ ISR: REAL-TIME UPDATE SYSTEM (60s)
// ==========================================
export const revalidate = 60;

// ==========================================
// 1. STATIC GENERATION (SSG)
// ==========================================
export async function generateStaticParams() {
  const query = `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`;
  const slugs = await client.fetch(query).catch(() => []); 
  return slugs.map((service) => ({ slug: service.slug }));
}

// ==========================================
// 2. DYNAMIC SEO METADATA (Next.js 16)
// ==========================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // Next.js 16 Requirement

  const query = `*[_type == "service" && slug.current == $slug][0]{
    seoTitle,
    seoDescription,
    title,
    tagline,
    shortDescription,
    "image": mainImage.asset->url
  }`;
  
  const service = await client.fetch(query, { slug: resolvedParams.slug }).catch(() => null);

  if (!service) return {};

  return {
    title: service.seoTitle || `${service.title} | Get Into Feed`,
    description: service.seoDescription || service.shortDescription || service.tagline,
    openGraph: {
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.shortDescription || service.tagline,
      images: service.image ? [{ url: service.image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.shortDescription || service.tagline,
      images: service.image ? [service.image] : [],
    },
  };
}

// ==========================================
// 3. MAIN SERVER COMPONENT
// ==========================================
export default async function ServiceDetailPage({ params }) {
  const resolvedParams = await params; // Next.js 16 Requirement

// 🎯 SANITY GROQ QUERY (Updated for your exact schema)
  const query = `*[_type == "service" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    shortDescription,
    tagline,
    content,
    "mainImage": coverImage.asset->url, // 🟢 FIX: coverImage ko mainImage me map kar diya
    deliverables, // 🟢 Naya Add kiya
    faqs, // 🟢 Naya Add kiya
    seoTitle,
    seoDescription
  }`;
  
  const service = await client.fetch(query, { slug: resolvedParams.slug }).catch(() => null);

  // Agar user ne galat URL daala ya service exist nahi karti toh Next.js ka default 404 page dikhao
  if (!service) {
    notFound();
  }

  // 🚀 PASS DATA TO YOUR PREMIUM UI COMPONENT
  // 'service' prop pass kar rahe hain kyunki humne Client component mein yahi naam rakha tha
  return <ServiceDetailClient service={service} />;
}