"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

// ----------------------------------------------------------------------
// 1. Default Categories (Can also be fetched dynamically from Sanity)
// ----------------------------------------------------------------------
const CATEGORIES = [
  "All",
  "Performance Marketing",
  "Social Media",
  "Branding",
  "Growth",
];

// ----------------------------------------------------------------------
// 2. Framer Motion Variants
// ----------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

export default function SearchFilter({ posts = [], onFilterChange }) {
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // ----------------------------------------------------------------------
  // 3. Dynamic Filtering Logic (Real-time & Client-side for Speed)
  // ----------------------------------------------------------------------
  useEffect(() => {
    let filtered = [...posts];

    // Step A: Filter by Category
    if (activeCategory !== "All") {
      filtered = filtered.filter((post) => {
        // Adjust this logic based on your exact Sanity schema
        // Assuming post.category is a string, OR post.categories is an array of objects
        const categoryList = post.category || (post.categories?.map(c => c.title)) || [];
        return Array.isArray(categoryList) 
          ? categoryList.includes(activeCategory)
          : categoryList === activeCategory;
      });
    }

    // Step B: Filter by Search Query
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        const matchTitle = post.title?.toLowerCase().includes(lowerQuery);
        const matchExcerpt = post.excerpt?.toLowerCase().includes(lowerQuery);
        const matchTags = post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
        
        return matchTitle || matchExcerpt || matchTags;
      });
    }

    // Pass the filtered array back to the parent component (Blog Grid)
    onFilterChange(filtered);
  }, [searchQuery, activeCategory, posts, onFilterChange]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="w-full max-w-4xl mx-auto px-6 md:px-12 -mt-6 relative z-20 flex flex-col items-center gap-8 mb-12"
    >
      
      {/* ================= SEARCH BAR ================= */}
      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#2ED1B2] transition-colors duration-300" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles, insights, or tags..."
          className="w-full bg-white border border-[#E5E7EB] text-[#0F172A] font-['Inter',sans-serif] text-base md:text-lg rounded-full py-4 pl-14 pr-12 shadow-sm outline-none transition-all duration-300 focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/15 placeholder:text-slate-400"
        />

        {/* Clear Search Button */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-[#0F172A] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ================= CATEGORY FILTERS ================= */}
      {/* Scrollable container for mobile support */}
      <div className="w-full overflow-x-auto pb-4 hide-scrollbar flex justify-start md:justify-center">
        <div className="flex items-center gap-2 md:gap-3 px-1">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-5 py-2.5 rounded-full text-sm md:text-[15px] font-['Plus_Jakarta_Sans',sans-serif] font-bold tracking-wide transition-all duration-300 flex-shrink-0
                  ${isActive ? "text-white" : "text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]"}
                `}
              >
                {/* Framer Motion Sliding Pill Background (Ultra Premium UX) */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] rounded-full -z-10 shadow-md shadow-[#2ED1B2]/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {category}
              </button>
            );
          })}
        </div>
      </div>
      
    </motion.div>
  );
}