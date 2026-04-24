import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';

// 🟢 Sahi Import Path
import ServiceClient from '@/app/services/ServiceClient'; 

export const revalidate = 60;

export async function generateStaticParams() {
  const query = `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`;
  const slugs = await client.fetch(query);
  return slugs.map((service) => ({ slug: service.slug }));
}

// ==========================================
// 🟢 FIX 1: generateMetadata mein params ko await kiya
// ==========================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // <--- NEXT.JS 16 FIX

  const query = `*[_type == "service" && slug.current == $slug][0]{
    seoTitle,
    seoDescription,
    title,
    tagline,
    "image": coverImage.asset->url
  }`;
  
  const service = await client.fetch(query, { slug: resolvedParams.slug });

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
// 🟢 FIX 2: Main Component mein params ko await kiya
// ==========================================
export default async function ServicePage({ params }) {
  const resolvedParams = await params; // <--- NEXT.JS 16 FIX

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

  const data = await client.fetch(query, { slug: resolvedParams.slug });

  if (!data) notFound();

  return (
    <main className="bg-[#F8F9FB] min-h-screen relative selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <ServiceClient data={data} />
    </main>
  );
}