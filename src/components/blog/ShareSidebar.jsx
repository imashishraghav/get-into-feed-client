"use client";

import { Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// 🟢 Native SVGs for Brands (Since Lucide removed them)
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ShareSidebar({ title, slug }) {
  const [copied, setCopied] = useState(false);
  
  // Assumes your domain will be configured
  const url = typeof window !== 'undefined' ? window.location.href : `https://getintofeed.com/blog/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-full shadow-sm border border-[#E5E7EB]">
      <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-2">Share</p>
      
      <a href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" 
         className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center text-[#475569] hover:text-[#2ED1B2] hover:bg-[#2ED1B2]/10 transition-colors">
        <TwitterIcon />
      </a>
      
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer"
         className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center text-[#475569] hover:text-[#2ED1B2] hover:bg-[#2ED1B2]/10 transition-colors">
        <LinkedinIcon />
      </a>
      
      <button onClick={handleCopy} className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center text-[#475569] hover:text-[#2ED1B2] hover:bg-[#2ED1B2]/10 transition-colors">
        {copied ? <CheckCircle2 className="w-4 h-4 text-[#2ED1B2]" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}