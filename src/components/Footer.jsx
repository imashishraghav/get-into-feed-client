"use client"; 

import React from 'react';
import { Globe, MessageSquare, Share2, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-[#05080f] pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Col */}
        <div className="col-span-1 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6 cursor-pointer">
            <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
               <img src="/logo.png" alt="Get Into Feed Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">GET INTO FEED</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            The ultimate growth engine for modern brands. We turn attention into revenue through cutting-edge social media strategies.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3AE272]/20 hover:text-[#3AE272] hover:border-[#3AE272]/50 transition-all text-gray-400"><Globe className="w-5 h-5" /></Link>
            <Link href="/contact" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3AE272]/20 hover:text-[#3AE272] hover:border-[#3AE272]/50 transition-all text-gray-400"><MessageSquare className="w-5 h-5" /></Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3AE272]/20 hover:text-[#3AE272] hover:border-[#3AE272]/50 transition-all text-gray-400"><Share2 className="w-5 h-5" /></Link>
          </div>
        </div>

        {/* Links Col 1 */}
        <div>
          <h4 className="text-white font-bold mb-6">Solutions</h4>
          <ul className="space-y-4">
            <li><Link href="/services" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">Social Media Growth</Link></li>
            <li><Link href="/services" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">Performance Marketing</Link></li>
            <li><Link href="/services" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">Content Creation</Link></li>
            <li><Link href="/services" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">Influencer Outreach</Link></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">About Us</Link></li>
            <li><Link href="/case-studies" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">Case Studies</Link></li>
            <li><Link href="/pricing" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">Pricing Plans</Link></li>
            <li><Link href="/careers" className="text-gray-400 hover:text-[#3AE272] text-sm transition-colors">Careers</Link></li>
          </ul>
        </div>

        {/* Newsletter Col */}
        <div>
          <h4 className="text-white font-bold mb-6">Stay Ahead</h4>
          <p className="text-gray-400 text-sm mb-4">Get the latest growth hacks and marketing trends delivered weekly.</p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="email" placeholder="Enter your email" className="w-full bg-[#0b1015] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3AE272]/50 transition-colors" />
            </div>
            <button className="w-full bg-[#3AE272] text-[#022c22] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4df287] shadow-[0_0_15px_rgba(58,226,114,0.2)] transition-all">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
 
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Get Into Feed. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-500">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;