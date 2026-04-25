"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" } // Trigger jab heading screen ke top par ho
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset for sticky header
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="flex flex-col gap-4">
      <p className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.2em] mb-2">
        Table of Contents
      </p>
      <ul className="flex flex-col gap-3 border-l border-[#E5E7EB]">
        {headings.map((heading) => (
          <li key={heading.id} className={`${heading.level === 'h3' ? 'ml-4' : ''}`}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block text-sm font-medium transition-all duration-300 border-l-2 -ml-[1px] pl-4 ${
                activeId === heading.id
                  ? "text-[#2ED1B2] border-[#2ED1B2]"
                  : "text-[#475569] border-transparent hover:text-[#0F172A] hover:border-gray-300"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
