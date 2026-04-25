"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, Clock, ArrowUpDown } from "lucide-react";
import CommentForm from "./CommentForm";

export default function CommentSection({ postId, initialComments = [] }) {
  const [sortOrder, setSortOrder] = useState("newest"); // Advanced Feature 1: Sorting
  const [likedComments, setLikedComments] = useState({}); // Advanced Feature 2: Interactive Likes

  // Sorting Logic
  // 🟢 FIX: Added .getTime() to strictly convert dates to numbers for subtraction
  const sortedComments = [...initialComments].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
    }
    return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
  });

  const toggleLike = (id) => {
    setLikedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-4xl mx-auto mt-20 pt-16 border-t border-[#E5E7EB]">
      
      {/* Header & Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <h2 className="text-3xl font-extrabold text-[#0F172A] flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#2ED1B2]" />
          Discussion ({initialComments.length})
        </h2>
        
        {initialComments.length > 1 && (
          <button 
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="flex items-center gap-2 text-sm font-bold text-[#475569] hover:text-[#0EA5A4] transition-colors px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by {sortOrder === "newest" ? "Oldest" : "Newest"}
          </button>
        )}
      </div>

      {/* Form Area */}
      <div className="mb-16">
        <CommentForm postId={postId} />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.length === 0 ? (
          <div className="text-center py-16 bg-[#F8F9FB] border border-dashed border-[#E5E7EB] rounded-[1.5rem]">
            <MessageSquare className="w-12 h-12 text-[#94A3B8] mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold text-[#0F172A]">No comments yet.</p>
            <p className="text-[#475569] mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div key={comment._id} className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {/* Premium Initial Avatar */}
                  <div className="w-12 h-12 bg-[#F8F9FB] text-[#0EA5A4] border border-[#E5E7EB] rounded-full flex items-center justify-center font-extrabold text-lg uppercase shadow-sm">
                    {comment.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-lg">{comment.name}</h4>
                    <p className="text-[#475569] text-xs font-medium flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(comment._createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[#475569] leading-relaxed mb-5 text-[15px]">
                {comment.comment}
              </p>

              {/* Advanced Feature 2: Like Button (Optimistic UI) */}
              <button 
                onClick={() => toggleLike(comment._id)}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${likedComments[comment._id] ? 'text-[#2ED1B2]' : 'text-[#94A3B8] hover:text-[#0F172A]'}`}
              >
                <ThumbsUp className={`w-4 h-4 ${likedComments[comment._id] ? 'fill-[#2ED1B2]' : ''}`} />
                {likedComments[comment._id] ? 'Liked' : 'Helpful'}
              </button>

            </div>
          ))
        )}
      </div>

    </section>
  );
}