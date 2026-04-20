// ============================================================================
// 🟢 SANITY CLIENT IMPORT
// ============================================================================
import { client } from "@/sanity/lib/client"; 

// ============================================================================
// 🟢 COMPONENTS IMPORTS
// ============================================================================
import BlogHero from "@/components/blog/BlogHero";
import BlogClient from "./BlogClient"; // ✅ FIX: Relative import kyunki file same folder mein hai
import Newsletter from "@/components/blog/Newsletter";
import BlogCTA from "@/components/blog/BlogCTA";

// ============================================================================
// 🟢 SEO METADATA
// ============================================================================
export const metadata = {
  title: "Insights & Resources | Get Into Feed",
  description: "Learn how to generate leads, scale your campaigns, and build predictable growth systems with our expert insights.",
  openGraph: {
    title: "Insights & Resources | Get Into Feed",
    description: "Learn how to generate leads, scale your campaigns, and build predictable growth systems.",
  },
};

// ============================================================================
// 🟢 MAIN PAGE COMPONENT (Server Component)
// ============================================================================
export default async function BlogPage() {
  
  // 1. Fetch Data from Sanity CMS
  const query = `*[_type == "post"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    "category": categories[0]->title,
    "imageUrl": mainImage.asset->url,
    readTime
  }`;

  // 2. Fetching live data with revalidation
  let posts = [];
  try {
    posts = await client.fetch(query, {}, { next: { revalidate: 60 } }); 
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
  }

  // 3. Render the Page Flow
  return (
    <main className="flex flex-col min-h-screen w-full bg-[#F8F9FB] overflow-hidden scroll-smooth">
      
      {/* 1. The Welcome & Mindset Shift */}
      <BlogHero />
      
      {/* 2. Interactive Section (Search -> Featured -> Grid) */}
      <BlogClient initialPosts={posts} />
      
      {/* 3. Value Capture (Email Subscription) */}
      <Newsletter />
      
      {/* 4. The Final Conversion Push */}
      <BlogCTA />

    </main>
  );
}