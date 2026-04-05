"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = ({ theme = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isDark = theme === 'dark';

  // Naye Pages Yahan Add Kiye Gaye Hain 👇
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBaseClass = "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b";
  
  const darkScrolledClass = "bg-[#030712]/85 backdrop-blur-xl border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 md:py-3";
  const darkTopClass = "bg-transparent border-transparent py-4 md:py-5";
  
  const lightScrolledClass = "bg-white/90 backdrop-blur-xl border-gray-200 shadow-sm py-2 md:py-3";
  const lightTopClass = "bg-white border-gray-100 py-4 md:py-5";

  const currentNavClass = `${navBaseClass} ${
    isDark 
      ? (isScrolled ? darkScrolledClass : darkTopClass)
      : (isScrolled ? lightScrolledClass : lightTopClass)
  }`;

  return (
    <nav className={currentNavClass}>
      {isDark && (
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3AE272]/20 to-transparent opacity-50"></div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center transition-all duration-500">
          
          {/* Left: Logo Section */}
          <Link href="/" className="flex-1 flex justify-start items-center group cursor-pointer gap-3">
            <img 
              className={`h-8 sm:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105 ${!isDark ? 'brightness-0' : ''}`} 
              src="/logo.png" 
              alt="Logo"
              onError={(e) => e.target.style.display = 'none'}
            />
            <span className={`font-extrabold text-lg md:text-xl tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              GET INTO FEED
            </span>
          </Link>

          {/* Center: Desktop Menu */}
          <div className="hidden lg:flex flex-none justify-center">
            <div className={`relative flex items-center rounded-full p-1.5 transition-all duration-500 ${
              isDark 
                ? 'bg-[#0f172a]/80 backdrop-blur-md border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]' 
                : 'bg-gray-100/80 backdrop-blur-md border border-gray-200/50'
            }`}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href; 
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3 xl:px-5 py-2.5 rounded-full text-[12px] xl:text-[13px] font-semibold tracking-wide transition-all duration-300 ease-out overflow-hidden z-10 ${
                      isActive
                        ? (isDark ? 'text-white' : 'text-slate-900')
                        : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5')
                    }`}
                  >
                    {isActive && (
                      <span className={`absolute inset-0 rounded-full -z-10 transition-all duration-500 ${
                        isDark 
                          ? 'bg-gradient-to-r from-[#3AE272]/0 via-[#3AE272]/15 to-[#3AE272]/0 border border-[#3AE272]/30 shadow-[inset_0_0_15px_rgba(58,226,114,0.2)]' 
                          : 'bg-white shadow-sm border border-gray-200/50'
                      }`}></span>
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: CTA Button & Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <Link href="/contact" className={`hidden md:block relative group font-bold px-8 py-3 rounded-full transition-all duration-300 overflow-hidden ${
              isDark 
                ? 'bg-[#3AE272] text-[#022c22] hover:bg-[#4df287] shadow-[0_0_20px_rgba(58,226,114,0.2)] hover:shadow-[0_0_30px_rgba(58,226,114,0.4)]' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}>
              {isDark && <span className="absolute inset-0 w-full h-full bg-white/30 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></span>}
              <span className="relative z-10">Contact Us</span>
            </Link>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-[#3AE272]' 
                    : 'bg-gray-100 border border-gray-200 text-slate-800 hover:bg-gray-200'
                }`}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-in-out origin-top ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className={`px-6 pt-4 pb-8 space-y-2 border-b shadow-2xl ${
          isDark 
            ? 'bg-[#0b1015]/95 backdrop-blur-2xl border-white/10' 
            : 'bg-white/95 backdrop-blur-2xl border-gray-200'
        }`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left px-5 py-3.5 rounded-xl text-base font-bold transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? (isDark ? 'text-[#3AE272] bg-[#3AE272]/10' : 'text-slate-900 bg-gray-100')
                    : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50')
                }`}
              >
                {isActive && isDark && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#3AE272]"></span>
                )}
                {link.name}
              </Link>
            );
          })}
          
          <Link href="/contact" onClick={() => setIsOpen(false)} className={`mt-6 block w-full text-center font-bold px-6 py-4 rounded-xl transition-all ${
            isDark 
              ? 'bg-[#3AE272] text-[#022c22] shadow-[0_0_15px_rgba(58,226,114,0.2)]' 
              : 'bg-slate-900 text-white shadow-md'
          }`}>
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;