import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import CaseStudyClient from '@/components/Case Studies/CaseStudyClient';

export const revalidate = 60;

export async function generateStaticParams() {
  const query = `*[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current }`;
  const slugs = await client.fetch(query);
  
  return slugs.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }) {
  const query = `*[_type == "caseStudy" && slug.current == $slug][0]{
    seoTitle,
    seoDescription,
    title,
    overview,
    "image": image.asset->url
  }`;
  
  const study = await client.fetch(query, { slug: params.slug });

  if (!study) return {};

  return {
    title: study.seoTitle || `${study.title} | Case Study`,
    description: study.seoDescription || study.overview,
    openGraph: {
      title: study.seoTitle || study.title,
      description: study.seoDescription || study.overview,
      images: study.image ? [{ url: study.image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: study.seoTitle || study.title,
      description: study.seoDescription || study.overview,
      images: study.image ? [study.image] : [],
    },
  };
}

export default async function CaseStudyPage({ params }) {
  // 🎯 CRITICAL: SANITY GROQ QUERY
  const query = `*[_type == "caseStudy" && slug.current == $slug][0]{
    title,
    clientName,
    industry,
    overview,
    problem,
    strategy,
    execution,
    conclusion,
    result,
    results[],
    testimonial{
      quote,
      name,
      role,
      company,
      "image": image.asset->url
    },
    "image": image.asset->url,
    "images": images[].asset->url,
    seoTitle,
    seoDescription,
    publishedAt
  }`;

  const data = await client.fetch(query, { slug: params.slug });

  if (!data) {
    notFound();
  }

  return (
    <CaseStudyClient data={data} />
  );
}