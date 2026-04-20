"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Users, 
  ShoppingBag, 
  Briefcase, 
  Building2, 
  Star 
} from "lucide-react";

// 🟢 Import your custom animation variants
import { staggerContainer, fadeUp } from "../../utils/animations";

// ----------------------------------------------------------------------
// Target Audience Data
// ----------------------------------------------------------------------
const targetSegments = [
  {
    id: "coaches",
    title: "Coaches & Consultants",
    description: "Want consistent leads and predictable clients.",
    icon: Users,
  },
  {
    id: "ecommerce",
    title: "E-commerce Brands",
    description: "Want to scale revenue with profitable, high-ROAS ads.",
    icon: ShoppingBag,
  },
  {
    id: "service",
    title: "Service-Based Businesses",
    description: "Want more qualified inquiries and higher conversions.",
    icon: Briefcase,
  },
  {
    id: "real-estate",
    title: "Real Estate Businesses",
    description: "Want high-quality leads and better closing rates.",
    icon: Building2,
  },
  {
    id: "personal-brands",
    title: "Personal Brands",
    description: "Want to grow their audience and monetize effectively.",
    icon: Star,
  },
];

export default function WhoItsFor() {
  const containerRef = useRef(null);

  // Localized Scroll Parallax for Section Lift
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 25 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white py-16 md:py-24 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      {/* Subtle Ambient Glow for Depth */}
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-[#2ED1B2]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-[#F8F9FB] px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Who We Work With
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
          >
            Built for Brands That Are{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Serious About Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            We work best with businesses that want to scale predictably, not just experiment with random tactics.
          </motion.p>
        </motion.div>

        {/* ================= CARDS GRID ================= */}
        {/* Using a flex layout with wrap and center alignment handles the odd number (5) of items beautifully */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: sectionLift }}
          className="flex flex-wrap justify-center gap-6"
        >
          {targetSegments.map((segment) => (
            <SegmentCard key={segment.id} data={segment} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Target Segment Card
// ----------------------------------------------------------------------
function SegmentCard({ data }) {
  const Icon = data.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      // Responsive sizing: full width on mobile, half on tablet, 1/3 minus gap on desktop
      className="group relative bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl p-8 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] transition-all duration-300 ease-out hover:border-[#2ED1B2]/40 hover:shadow-[0_20px_40px_-10px_rgba(46,209,178,0.12)] hover:bg-white overflow-hidden flex flex-col items-start text-left cursor-default"
    >
      {/* 🟢 Premium Left-Border Accent on Hover */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2ED1B2] to-[#0EA5A4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Subtle Inner Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#2ED1B2]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start w-full">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-6 text-[#475569] group-hover:text-[#0EA5A4] group-hover:bg-[#2ED1B2]/5 group-hover:border-[#2ED1B2]/30 transition-colors duration-300 shadow-sm">
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-bold text-[#0F172A] mb-2 tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
          {data.title}
        </h3>
        
        <p className="text-[15px] md:text-base text-[#475569] font-medium leading-relaxed">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}