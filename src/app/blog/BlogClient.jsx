"use client";

import React, { useState } from "react";
import SearchFilter from "@/components/blog/SearchFilter";
import BlogGrid from "@/components/blog/BlogGrid";

export default function BlogClient({ initialPosts }) {
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const hasPosts = filteredPosts && filteredPosts.length > 0;
  
  const featuredPost = hasPosts ? filteredPosts[0] : null;
  const gridPosts = hasPosts ? filteredPosts.slice(1) : [];

  return (
    <>
      <SearchFilter posts={initialPosts} onFilterChange={setFilteredPosts} />
      
      {gridPosts.length > 0 ? (
        <BlogGrid posts={gridPosts} />
      ) : (
        <div className="w-full text-center py-20 bg-[#F8F9FB]">
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#0F172A] mb-2">No articles found</h3>
          <p className="font-['Inter',sans-serif] text-[#475569]">Try adjusting your search or category filters.</p>
        </div>
      )}
    </>
  );
}