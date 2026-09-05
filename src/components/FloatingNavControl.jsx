import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Hand } from "lucide-react";

export default function FloatingNavControl() {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setCanScrollUp(scrollY > 60);
      setCanScrollDown(scrollY < maxScroll - 60);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const sectionIds = ["navbar", "services", "industries", "ways-to-work", "pricing", "about", "contact"];

  const handleScrollUp = (e) => {
    e.preventDefault();
    const currentY = window.scrollY;
    let targetY = 0;
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (el) {
        const top = el.offsetTop - 30;
        if (top < currentY - 50) {
          targetY = top;
          break;
        }
      }
    }
    window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
  };

  const handleScrollDown = (e) => {
    e.preventDefault();
    const currentY = window.scrollY;
    let targetY = document.documentElement.scrollHeight;
    for (let i = 0; i < sectionIds.length; i++) {
      const el = document.getElementById(sectionIds[i]);
      if (el) {
        const top = el.offsetTop - 20;
        if (top > currentY + 50) {
          targetY = top;
          break;
        }
      }
    }
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center bg-[#09090B] border-2 border-[#D4FF00] rounded-full p-1.5 backdrop-blur-md transition-all duration-300 select-none pointer-events-auto"
      style={{
        width: "46px",
        boxShadow: "0 0 22px rgba(212, 255, 0, 0.35), 0 8px 30px rgba(0,0,0,0.8)"
      }}
      aria-label="Floating Navigation Control"
    >
      {/* UP BUTTON */}
      <button
        type="button"
        onClick={handleScrollUp}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none ${
          canScrollUp
            ? "text-[#D4FF00] hover:bg-[#D4FF00] hover:text-[#09090B] active:scale-95"
            : "text-gray-500 hover:text-[#D4FF00] hover:bg-[#18181B]"
        }`}
        style={{ background: "transparent" }}
        title="Scroll Up"
        aria-label="Scroll Up"
      >
        <ChevronUp size={20} strokeWidth={2.5} />
      </button>

      {/* HAND INDICATOR CUE */}
      <div
        className="w-7 h-7 my-1 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center text-[#D4FF00] select-none"
        title="Quick Navigator"
      >
        <Hand size={13} className="text-[#D4FF00]" strokeWidth={2.2} />
      </div>

      {/* DOWN BUTTON */}
      <button
        type="button"
        onClick={handleScrollDown}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none ${
          canScrollDown
            ? "text-[#D4FF00] hover:bg-[#D4FF00] hover:text-[#09090B] active:scale-95"
            : "text-gray-500 hover:text-[#D4FF00] hover:bg-[#18181B]"
        }`}
        style={{ background: "transparent" }}
        title="Scroll Down"
        aria-label="Scroll Down"
      >
        <ChevronDown size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
