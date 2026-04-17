"use client"; 

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] border-t border-gray-200 w-full mt-auto font-sans relative overflow-hidden">
      
      {/* Subtle Background Glow - Adjusted opacity for light mode */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3AE272]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* 🟢 MAIN SECTION: Strict Corporate Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* 1. Brand Details */}
          <div className="col-span-1 lg:col-span-4 lg:pr-12 flex flex-col justify-start">
            <Link href="/" className="inline-block mb-8 group w-max">
              <img 
                src="/logo.png" 
                alt="Get Into Feed" 
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="space-y-2 text-gray-600 text-[15px] font-medium leading-relaxed">
              <p>New Delhi, India</p>
              <a href="mailto:sales@getintofeed.com" className="block hover:text-slate-900 transition-colors duration-300">
                sales@getintofeed.com
              </a>
            </div>
          </div>

          {/* 2. Links: Capabilities */}
          <div className="col-span-1 lg:col-span-3">
            <h4 className="text-slate-900 text-[13px] font-bold uppercase tracking-widest mb-8">Capabilities</h4>
            <ul className="space-y-5">
              <li><Link href="/services" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Social Media Growth</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Performance Marketing</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Content Production</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Brand Strategy</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Influencer Campaigns</Link></li>
            </ul>
          </div>

          {/* 3. Links: Agency */}
          <div className="col-span-1 lg:col-span-3">
            <h4 className="text-slate-900 text-[13px] font-bold uppercase tracking-widest mb-8">Agency</h4>
            <ul className="space-y-5">
              <li><Link href="/about" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">About Us</Link></li>
              <li><Link href="/case-studies" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Our Work</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">News & Insights</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-slate-900 text-[15px] font-medium transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* 🟢 4. Links: Socials */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-slate-900 text-[13px] font-bold uppercase tracking-widest mb-8">Socials</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="group" aria-label="Facebook">
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5 brightness-0 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300" />
              </a>
              <a href="#" className="group" aria-label="Instagram">
                <img src="/instagram.svg" alt="Instagram" className="w-5 h-5 brightness-0 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300" />
              </a>
              <a href="#" className="group" aria-label="Twitter">
                <img src="/twitter-alt.svg" alt="Twitter" className="w-5 h-5 brightness-0 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300" />
              </a>
              <a href="#" className="group" aria-label="LinkedIn">
                <img src="/linkedin.svg" alt="LinkedIn" className="w-5 h-5 brightness-0 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300" />
              </a>
              <a href="#" className="group" aria-label="YouTube">
                <img src="/youtube.svg" alt="YouTube" className="w-5 h-5 brightness-0 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 🟢 PARTNER BADGES (Trust Authority) */}
      <div className="border-t border-gray-200 bg-[#F3F4F6] relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest">Official Partners</p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* Hover changes opacity to 100%, keeping it pure black (brightness-0) */}
            <img 
              src="/Meta-Partner-Badge-2.webp" 
              alt="Meta Business Partner" 
              className="h-12 w-auto object-contain brightness-0 opacity-50 hover:opacity-100 transition-all duration-500" 
            />
            <img 
              src="/google-partner-white-5.webp" 
              alt="Google Partner" 
              className="h-12 w-auto object-contain brightness-0 opacity-50 hover:opacity-100 transition-all duration-500" 
            />
            <img 
              src="/25-microsoft-advertising-badge.webp" 
              alt="Microsoft Advertising Partner" 
              className="h-10 w-auto object-contain brightness-0 opacity-50 hover:opacity-100 transition-all duration-500" 
            />
            <img 
              src="/clutch.svg" 
              alt="Clutch" 
              className="h-7 w-auto object-contain brightness-0 opacity-50 hover:opacity-100 transition-all duration-500" 
            />
          </div>
        </div>
      </div>

      {/* 🟢 BOTTOM SECTION: Ultra-clean Legal Bar */}
      <div className="border-t border-gray-200 bg-[#F9FAFB] relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-[13px] font-medium">
            © {new Date().getFullYear()} Get Into Feed. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[13px] font-medium text-gray-500">
            <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-slate-900 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;