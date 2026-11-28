import React, { useEffect } from "react";
import { Home, Layers } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";

export function NotFoundPage({ onNavigate }) {
  useEffect(() => {
    document.title = "Page Not Found (404) | GetIntoFeed";
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout onNavigate={onNavigate} fullWidth={true}>
      <div className="w-full max-w-full font-inter antialiased text-[#111827] bg-[#ffffff] relative min-h-[calc(100vh-140px)] flex items-center justify-center py-16 sm:py-24 overflow-hidden">
        {/* Pattern Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#f3f4f6 1px, transparent 1px), linear-gradient(90deg, #f3f4f6 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#d4ff00] rounded-full filter blur-[150px] opacity-25 pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-[#111827] text-[#d4ff00] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-sm">
            Error 404
          </div>

          <div className="relative mb-2 select-none">
            <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-black text-[#111827] leading-none tracking-tighter font-space">
              <span className="sr-only">Page Not Found — </span>4<span className="text-[#d4ff00] drop-shadow-[0_4px_14px_rgba(212,255,0,0.39)]">0</span>4
            </h1>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight text-[#111827] font-space">
            Looks like you <br />
            scrolled <span className="text-[#b8e600] underline decoration-4 underline-offset-4">too far.</span>
          </h2>

          <p className="text-lg md:text-xl text-[#4b5563] max-w-xl mx-auto font-medium mb-10 leading-relaxed font-sans">
            The page you are looking for has been moved, deleted, or never existed. Let's get you back to high-converting growth content.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="w-full sm:w-auto bg-[#d4ff00] text-[#111827] font-black py-4 px-10 rounded-xl hover:bg-[#b8e600] transition shadow-[0_4px_14px_0_rgba(212,255,0,0.39)] uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer border-none text-sm active:scale-95"
            >
              <Home className="w-4 h-4 inline mr-2" /> Back To Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/services")}
              className="w-full sm:w-auto bg-white border-2 border-[#111827] text-[#111827] font-bold py-4 px-10 rounded-xl hover:bg-[#f9fafb] transition uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer text-sm active:scale-95"
            >
              <Layers className="w-5 h-5 inline mr-2" /> View Services
            </button>
          </div>

          <div className="mt-12 text-sm font-semibold text-[#4b5563]">
            Need immediate help?{" "}
            <button
              type="button"
              onClick={() => onNavigate("/contact")}
              className="text-[#111827] border-b border-[#d4ff00] hover:text-[#b8e600] transition pb-0.5 bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer font-bold p-0 text-sm"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default NotFoundPage;
