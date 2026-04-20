"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { 
  Target, 
  PenTool, 
  Lightbulb, 
  Megaphone, 
  Share2, 
  Monitor, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

// 🟢 Import your custom animation variants
import { staggerContainer, fadeUp } from "../../utils/animations";

// ----------------------------------------------------------------------
// Detailed Services Data
// ----------------------------------------------------------------------
const breakdownData = [
  {
    id: "performance",
    title: "Performance Marketing",
    description: "We don't just buy ads; we acquire customers. Using data-driven media buying across Meta and Google, we scale your revenue while protecting your profit margins.",
    benefits: [
      "ROI-focused media buying & budget allocation",
      "Cross-channel scaling (Meta, Google, LinkedIn)",
      "Continuous A/B testing & unit economic tracking"
    ],
    icon: Target,
    href: "/services/performance-marketing",
  },
  {
    id: "creative",
    title: "Creative Strategy & Design",
    description: "Attention is the new currency. We engineer high-converting ad creatives, landing pages, and visual assets designed specifically to stop the scroll and drive action.",
    benefits: [
      "Conversion-optimized static and video creatives",
      "High-performing landing page UI/UX design",
      "Rapid creative testing and iteration frameworks"
    ],
    icon: PenTool,
    href: "/services/creative-strategy",
  },
  {
    id: "strategy",
    title: "Digital Strategy & Planning",
    description: "Tactics fail without a map. We build comprehensive growth roadmaps, audience architectures, and full-funnel strategies tailored to your exact business goals.",
    benefits: [
      "Full-funnel customer journey architecture",
      "Unit economic modeling and CPA targets",
      "Deep-dive audience profiling and segmentation"
    ],
    icon: Lightbulb,
    href: "/services/digital-strategy",
  },
  {
    id: "influencer",
    title: "Influencer Marketing",
    description: "Build authentic trust at scale. We orchestrate strategic creator partnerships and User-Generated Content (UGC) campaigns that drive measurable direct conversions.",
    benefits: [
      "Strategic creator matchmaking and outreach",
      "High-converting UGC asset production",
      "Performance-based tracking and attribution"
    ],
    icon: Megaphone,
    href: "/services/influencer-marketing",
  },
  {
    id: "social",
    title: "Social Media Marketing",
    description: "Turn your feed into a community. We position your brand as an authority through viral organic content strategies and proactive community management.",
    benefits: [
      "Organic community building and engagement",
      "Brand authority positioning and voice design",
      "Viral content ideation and execution"
    ],
    icon: Share2,
    href: "/services/social-media-marketing",
  },
  {
    id: "web",
    title: "Website Design & Development",
    description: "Your website is your best salesperson. We build lightning-fast, SEO-optimized marketing websites on modern tech stacks to maximize your conversion rates.",
    benefits: [
      "Lightning-fast Next.js & React architectures",
      "Technical SEO and performance optimization",
      "Frictionless, high-converting user flows"
    ],
    icon: Monitor,
    href: "/services/web-development",
  },
];

export default function ServiceBreakdown() {
  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-32 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-[#F8F9FB] px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Our Services
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
          >
            Built to Solve Real <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Growth Problems.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            Each service is designed to work together as part of a complete, revenue-generating growth system.
          </motion.p>
        </motion.div>

        {/* ================= STACKED BLOCKS ================= */}
        <div className="flex flex-col gap-12 md:gap-20 lg:gap-32">
          {breakdownData.map((service, index) => (
            <ServiceBlock key={service.id} data={service} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Alternating Service Block
// ----------------------------------------------------------------------
function ServiceBlock({ data, index }) {
  const blockRef = useRef(null);
  const isEven = index % 2 === 0;
  const Icon = data.icon;

  // Local Parallax for the Visual side to float slightly while scrolling
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });
  
  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const floatY = useSpring(rawY, { stiffness: 80, damping: 25 });

  return (
    <motion.div
      ref={blockRef}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="group relative flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-20 items-center p-8 md:p-12 lg:p-16 rounded-[2.5rem] bg-white border border-[#E5E7EB] transition-all duration-500 ease-out hover:border-[#2ED1B2]/40 hover:shadow-[0_30px_60px_-15px_rgba(46,209,178,0.12)]"
    >
      {/* Subtle Background Hover Highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FB] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none -z-0" />

      {/* ================= CONTENT COLUMN ================= */}
      {/* Dynamic ordering based on odd/even index */}
      <div className={`relative z-10 flex flex-col ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-5 tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
          {data.title}
        </h3>
        
        <p className="text-lg text-[#475569] leading-relaxed font-medium mb-8">
          {data.description}
        </p>

        {/* Benefits List */}
        <ul className="flex flex-col gap-4 mb-10">
          {data.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#2ED1B2] shrink-0 mt-0.5" />
              <span className="text-[15px] md:text-base text-[#475569] font-medium leading-relaxed">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div>
          <Link href={data.href} className="inline-flex items-center gap-2 group/btn focus:outline-none">
            <span className="text-lg font-bold text-[#0F172A] group-hover/btn:text-[#0EA5A4] transition-colors duration-300">
              Learn More
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center transition-all duration-300 group-hover/btn:bg-[#2ED1B2]/10 group-hover/btn:border-[#2ED1B2]/30 group-hover/btn:translate-x-1">
              <ArrowRight className="w-4 h-4 text-[#0F172A] group-hover/btn:text-[#0EA5A4] transition-colors duration-300" />
            </div>
          </Link>
        </div>
      </div>

      {/* ================= VISUAL COLUMN ================= */}
      <div className={`relative w-full h-full min-h-[300px] flex items-center justify-center rounded-[2rem] bg-[#F8F9FB] border border-[#E5E7EB]/50 overflow-hidden ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        
        {/* Animated Background Mesh in the visual box */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,209,178,0.05),transparent_70%)]" />

        <motion.div 
          style={{ y: floatY }} 
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-[#E5E7EB] flex items-center justify-center transition-transform duration-700 group-hover:scale-105 group-hover:shadow-[0_20px_50px_-10px_rgba(46,209,178,0.2)] group-hover:border-[#2ED1B2]/30"
        >
          {/* Subtle Glow Behind Icon */}
          <div className="absolute inset-0 bg-[#2ED1B2]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Icon className="w-12 h-12 md:w-16 md:h-16 text-[#475569] transition-colors duration-500 group-hover:text-[#0EA5A4]" strokeWidth={1.5} />
        </motion.div>
      </div>

    </motion.div>
  );
}