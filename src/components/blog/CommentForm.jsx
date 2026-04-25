"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function CommentForm({ postId }) {
  const [formData, setFormData] = useState({ name: "", email: "", comment: "" });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const maxChars = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({ ...formData, _id: postId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to submit");
      
      setStatus("success");
      setFormData({ name: "", email: "", comment: "" }); // Reset form
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-[#2ED1B2]/10 border border-[#2ED1B2]/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
        <CheckCircle className="w-10 h-10 text-[#2ED1B2]" />
        <h4 className="text-xl font-bold text-[#0F172A]">Thank you!</h4>
        <p className="text-[#475569]">Your comment has been submitted and is pending moderation.</p>
        <button onClick={() => setStatus("idle")} className="text-[#0EA5A4] text-sm font-bold mt-2 hover:underline">
          Write another comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-[#E5E7EB] shadow-sm">
      <h3 className="text-2xl font-extrabold text-[#0F172A] mb-6">Join the Discussion</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-[#0F172A] mb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0F172A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2ED1B2] focus:ring-1 focus:ring-[#2ED1B2] transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0F172A] mb-2">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0F172A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2ED1B2] focus:ring-1 focus:ring-[#2ED1B2] transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-[#0F172A] mb-2">Comment <span className="text-red-500">*</span></label>
        <textarea
          required
          rows={4}
          maxLength={maxChars}
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className="w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0F172A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2ED1B2] focus:ring-1 focus:ring-[#2ED1B2] transition-colors resize-none"
          placeholder="Share your thoughts..."
        />
        <div className="flex justify-end mt-2">
          <span className={`text-xs font-medium ${formData.comment.length >= maxChars ? 'text-red-500' : 'text-[#475569]'}`}>
            {formData.comment.length} / {maxChars}
          </span>
        </div>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-500 mb-4 text-sm font-medium">
          <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto bg-[#0F172A] text-white hover:bg-[#2ED1B2] hover:text-[#0F172A] px-8 py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : "Post Comment"}
      </button>
    </form>
  );
}