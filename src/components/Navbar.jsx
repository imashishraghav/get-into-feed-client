"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Path check karne ke liye hook
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Work", href: "/case-studies" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Career", href: "/careers" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Agar path Sanity Studio ka hai, toh Navbar hide kar do
  if (pathname.startsWith("/studio")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const customEase = [0.16, 1, 0.3, 1];

  return (
    <>
      <motion.nav
        initial={{ y: -100, backgroundColor: "rgba(249, 250, 251, 0)" }}
        animate={{ 
          y: 0, 
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0)" 
        }}
        transition={{ duration: 0.8, ease: customEase }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "backdrop-blur-xl border-b border-gray-200" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="relative z-50 group">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-1">
              Get Into Feed
              <span className="w-2 h-2 rounded-full bg-[#C9A227] group-hover:scale-150 transition-transform duration-500 ease-out"></span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group relative font-mono text-[10px] xl:text-[11px] font-bold text-gray-500 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors duration-300"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1.5px] bg-[#C9A227] transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:w-full"></span>
              </Link>
            ))}
            
            <Link href="/contact" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-6 px-7 py-3 bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#C9A227] transition-colors duration-300"
              >
                Let's Talk
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden relative z-50 p-2 transition-colors duration-300 ${
              isMobileMenuOpen ? "text-white" : "text-slate-900"
            }`}
          >
            {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.7, ease: customEase }}
            className="fixed inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center px-6"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C9A227] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>

            <div className="flex flex-col items-center gap-6 text-center mt-12 w-full max-w-md relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: customEase }}
              >
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter hover:text-[#C9A227] transition-colors duration-300 leading-[1.1]"
                >
                  Home
                </Link>
              </motion.div>

              {navLinks.map((link, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i + 1) * 0.05, duration: 0.6, ease: customEase }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter hover:text-[#C9A227] transition-colors duration-300 leading-[1.1]"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5, ease: customEase }}
                className="mt-8 w-full"
              >
                <Link href="/lets-talk" passHref>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-8 py-5 bg-white text-slate-900 font-mono text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#C9A227] hover:text-white transition-all duration-300"
                  >
                    Let's Talk
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}