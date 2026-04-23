// @ts-nocheck
"use client"; 

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Import global animations
import { staggerContainer, fadeUp, blurFadeUp } from '@/utils/animations';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-navy/10 w-full mt-auto font-sans relative overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu">
      
      {/* --- Advanced Breathing Background Glow --- */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1], 
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -z-10 transform-gpu" 
      />

      {/* 🟢 MAIN SECTION: Strict Corporate Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 transform-gpu"
        >
          
          {/* 1. Brand Details */}
          <motion.div variants={fadeUp} className="col-span-1 lg:col-span-4 lg:pr-12 flex flex-col justify-start">
            
            {/* UPDATED LOGO: Bigger Size + Glassmorphism + Text Removed */}
            <Link href="/" className="inline-block mb-8 group w-max">
              <motion.div 
                whileHover={{ rotate: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative w-[80px] h-[80px] rounded-2xl flex-shrink-0 border border-white/60 bg-white/50 backdrop-blur-md shadow-sm overflow-hidden transform-gpu"
              >
                <Image 
                  src="/gif.webp" 
                  alt="Get Into Feed Logo" 
                  fill 
                  className="object-contain p-2.5 drop-shadow-sm"
                  sizes="80px"
                />
              </motion.div>
            </Link>

            <div className="space-y-2 text-navy/70 text-[15px] font-sans font-medium leading-relaxed">
              <p>New Delhi, India</p>
              <a href="mailto:sales@getintofeed.com" className="block hover:text-secondary transition-colors duration-300">
                sales@getintofeed.com
              </a>
            </div>
          </motion.div>

          {/* 2. Links: Capabilities */}
          <motion.div variants={fadeUp} className="col-span-1 lg:col-span-3">
            <h4 className="text-navy text-[13px] font-heading font-bold uppercase tracking-widest mb-6 lg:mb-8">Capabilities</h4>
            <ul className="space-y-4 lg:space-y-5">
              {['Social Media Growth', 'Performance Marketing', 'Content Production', 'Brand Strategy', 'Influencer Campaigns'].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-navy/60 hover:text-secondary text-[15px] font-sans font-medium transition-colors relative group w-max flex items-center">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 ease-out group-hover:w-full rounded-full opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 3. Links: Agency */}
          <motion.div variants={fadeUp} className="col-span-1 lg:col-span-3">
            <h4 className="text-navy text-[13px] font-heading font-bold uppercase tracking-widest mb-6 lg:mb-8">Agency</h4>
            <ul className="space-y-4 lg:space-y-5">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Our Work', href: '/case-studies' },
                { name: 'News & Insights', href: '/blog' },
                { name: 'Careers', href: '/careers' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-navy/60 hover:text-secondary text-[15px] font-sans font-medium transition-colors relative group w-max flex items-center">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 ease-out group-hover:w-full rounded-full opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 🟢 4. Links: Socials */}
          <motion.div variants={fadeUp} className="col-span-1 lg:col-span-2">
            <h4 className="text-navy text-[13px] font-heading font-bold uppercase tracking-widest mb-6 lg:mb-8">Socials</h4>
            <div className="flex items-center gap-4">
              {[
                { name: 'Facebook', icon: '/facebook.svg' },
                { name: 'Instagram', icon: '/instagram.svg' },
                { name: 'Twitter', icon: '/twitter-alt.svg' },
                { name: 'LinkedIn', icon: '/linkedin.svg' },
                { name: 'YouTube', icon: '/youtube.svg' },
              ].map((social) => (
                <motion.a 
                  key={social.name}
                  whileHover={{ y: -4, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href="#" 
                  aria-label={social.name}
                  className="group relative w-5 h-5 block transform-gpu"
                >
                  <Image 
                    src={social.icon} 
                    alt={social.name} 
                    fill
                    className="brightness-0 opacity-40 group-hover:opacity-100 group-hover:filter-[brightness(0)_saturate(100%)_invert(57%)_sepia(57%)_saturate(442%)_hue-rotate(124deg)_brightness(94%)_contrast(88%)] transition-all duration-300" 
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* 🟢 PARTNER BADGES (Trust Authority) */}
      <div className="bg-navy relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10px" }}
          variants={staggerContainer}
          className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-8 transform-gpu"
        >
          <motion.p variants={blurFadeUp} className="text-white/60 font-sans text-[12px] font-bold uppercase tracking-widest shrink-0">
            Official Partners
          </motion.p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full lg:justify-end">
            {[
              { src: "/Meta-Partner-Badge-2.webp", alt: "Meta Business Partner", h: "h-12 w-32" },
              { src: "/google-partner-white-5.webp", alt: "Google Partner", h: "h-12 w-32" },
              { src: "/25-microsoft-advertising-badge.webp", alt: "Microsoft Advertising Partner", h: "h-10 w-28" },
              { src: "/clutch.svg", alt: "Clutch", h: "h-7 w-20" }
            ].map((badge) => (
              <motion.div 
                key={badge.alt} 
                variants={blurFadeUp} 
                className={`relative ${badge.h} opacity-70 transition-all duration-500 hover:scale-105 hover:opacity-100 cursor-pointer transform-gpu`}
              >
                <Image 
                  src={badge.src} 
                  alt={badge.alt} 
                  fill
                  className="object-contain"
                  sizes="150px"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 🟢 BOTTOM SECTION: Ultra-clean Legal Bar */}
      <div className="border-t border-navy/10 bg-background relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy/50 font-sans text-[13px] font-medium">
            © {new Date().getFullYear()} Get Into Feed. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[13px] font-sans font-medium text-navy/50">
            <Link href="/privacy-policy" className="hover:text-navy transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-navy transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-navy transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;