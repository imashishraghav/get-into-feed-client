"use client";

import React, { useState } from "react";
import SearchFilter from "@/components/blog/SearchFilter";
import BlogGrid from "@/components/blog/BlogGrid";

// 🟢 FIX: Agar aap apna 'FeaturedBlog' use karna chahte hain toh isko un-comment kar lena
// import FeaturedBlog from "@/components/blog/FeaturedBlog";

export default function BlogClient({ initialPosts = [] }) {
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  
  // 🟢 FIX: Check if we have ANY posts to show
  const hasPosts = filteredPosts && filteredPosts.length > 0;

  return (
    <>
      <SearchFilter posts={initialPosts} onFilterChange={setFilteredPosts} />
      
      {/* 🟢 FIX: If posts exist, show them. Else show the "Not Found" message */}
      {hasPosts ? (
        <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto px-6 mb-20">
          
          {/* 💡 Agar Featured Blog dikhana ho toh yahan aise laga sakte hain: */}
          {/* <FeaturedBlog post={filteredPosts[0]} /> */}
          
          {/* Poora Grid render karein */}
          <BlogGrid posts={filteredPosts} />
        </div>
      ) : (
        <div className="w-full text-center py-20 bg-[#F8F9FB] rounded-3xl mt-10">
          <h3 className="font-heading text-2xl font-bold text-[#0F172A] mb-2">
            No articles found
          </h3>
          <p className="font-sans text-[#475569]">
            Try adjusting your search or category filters.
          </p>
        </div>
      )}
    </>
  );
}
