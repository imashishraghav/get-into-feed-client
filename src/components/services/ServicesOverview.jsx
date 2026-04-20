"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Target, 
  PenTool, 
  Lightbulb, 
  Megaphone, 
  Share2, 
  Monitor, 
  ArrowRight 
} from "lucide-react";

// 🟢 Import your custom animation variants
import { staggerContainer, fadeUp } from "../../utils/animations";

// ----------------------------------------------------------------------
// Services Data
// ----------------------------------------------------------------------
const services = [
  {
    id: "performance-marketing",
    title: "Performance Marketing",
    description: "Data-driven media buying across Meta and Google to acquire high-value customers at the lowest CPA.",
    icon: Target,
    href: "/services/performance-marketing",
  },
  {
    id: "creative-strategy",
    title: "Creative Strategy & Design",
    description: "High-converting ad creatives, landing pages, and visual assets engineered specifically for maximum ROI.",
    icon: PenTool,
    href: "/services/creative-strategy",
  },
  {
    id: "digital-strategy",
    title: "Digital Strategy & Planning",
    description: "Comprehensive growth roadmaps, audience architecture, and full-funnel strategy mapping for long-term scale.",
    icon: Lightbulb,
    href: "/services/digital-strategy",
  },
  {
    id: "influencer-marketing",
    title: "Influencer Marketing",
    description: "Strategic creator partnerships and UGC campaigns that build authentic trust and drive direct conversions.",
    icon: Megaphone,
    href: "/services/influencer-marketing",
  },
  {
    id: "social-media",
    title: "Social Media Marketing",
    description: "Community building, brand positioning, and viral organic content strategies that dominate the feed.",
    icon: Share2,
    href: "/services/social-media-marketing",
  },
  {
    id: "web-development",
    title: "Website Design & Dev",
    description: "Lightning-fast, SEO-optimized marketing websites built on modern stacks to maximize conversion rates.",
    icon: Monitor,
    href: "/services/web-development",
  },
];

export default function ServicesOverview() {
  return (
    <section className="relative w-full bg-[#F8F9FB] py-16 md:py-24 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      {/* --- Subliminal Grid Background --- */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-white px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Our Services
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
          >
            Everything You Need to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Scale Your Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            Each service is designed to work together as a complete, unified growth system.
          </motion.p>
        </motion.div>

        {/* ================= SERVICES GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Service Card Component
// ----------------------------------------------------------------------
function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="h-full"
    >
      <Link href={service.href} className="block h-full group focus:outline-none">
        <div className="relative h-full bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-10 transition-all duration-300 ease-out hover:border-[#2ED1B2]/40 hover:shadow-[0_20px_40px_-10px_rgba(46,209,178,0.15)] flex flex-col overflow-hidden">
          
          {/* Subtle Corner Glow on Hover */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#2ED1B2]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Icon Area */}
          <div className="w-14 h-14 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center mb-8 transition-colors duration-300 group-hover:bg-[#2ED1B2]/5 group-hover:border-[#2ED1B2]/30 shrink-0">
            <Icon className="w-6 h-6 text-[#475569] transition-colors duration-300 group-hover:text-[#0EA5A4]" strokeWidth={1.5} />
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-3 tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
              {service.title}
            </h3>
            
            <p className="text-[15px] md:text-base text-[#475569] leading-relaxed font-medium mb-8">
              {service.description}
            </p>
            
            {/* Clickable Indicator (Pushes to bottom) */}
            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-[#2ED1B2] uppercase tracking-wider">
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}