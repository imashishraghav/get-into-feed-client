"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

// 🟢 Import your custom lag-free smooth scroll hook & animation utils
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "../../utils/animations";

/* // ============================================================================
// 🔌 SANITY CMS INTEGRATION (SERVER COMPONENT USAGE)
// ============================================================================
// 1. In your app/about/page.jsx (Server Component), fetch and pass the data:
//
// import { client } from "@/lib/sanity";
// import TestimonialsSection from "@/components/about/TestimonialsSection";
//
// const query = `*[_type == "testimonial"] | order(order asc) {
//   _id, name, role, company, feedback, rating, 
//   "imageUrl": image.asset->url, // Resolve the image URL directly in GROQ
//   isFeatured
// }`;
//
// export default async function AboutPage() {
//   const testimonials = await client.fetch(query);
//   return <TestimonialsSection testimonials={testimonials} />;
// }
// ============================================================================ */

// ----------------------------------------------------------------------
// Fallback Data (For development if Sanity is empty)
// ----------------------------------------------------------------------
const fallbackTestimonials = [
  {
    _id: "1",
    isFeatured: true,
    name: "Sarah Jenkins",
    role: "CMO",
    company: "Aura Skincare",
    rating: 5,
    feedback: "Get Into Feed didn't just run our ads; they rebuilt our entire acquisition engine. We moved from praying for a 2x ROAS to consistently hitting 4.5x within three months. Their unit-economic approach is unmatched.",
    imageUrl: null, // Test fallback avatar
  },
  {
    _id: "2",
    isFeatured: false,
    name: "David Chen",
    role: "Founder",
    company: "PropTech Solutions",
    rating: 5,
    feedback: "Finally, an agency that understands that clicks don't pay the bills. They scaled our lead volume by 300% while actually lowering our CPA.",
  },
  {
    _id: "3",
    isFeatured: false,
    name: "Elena Rodriguez",
    role: "VP of Marketing",
    company: "Luxe Real Estate",
    rating: 5,
    feedback: "The level of data-driven clarity they brought to our campaigns was eye-opening. No guesswork, just pure, scalable systems.",
  },
  {
    _id: "4",
    isFeatured: false,
    name: "Marcus Thorne",
    role: "CEO",
    company: "Thorne E-Commerce",
    rating: 5,
    feedback: "We were stuck at a revenue plateau for a year. Their creative strategy and media buying unlocked a totally new phase of growth for us.",
  },
];

// ----------------------------------------------------------------------
// Shared Helpers
// ----------------------------------------------------------------------
const renderStars = (rating) => {
  const validRating = Math.min(Math.max(rating || 5, 0), 5);
  return (
    <div className="flex gap-1 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`transition-colors duration-300 ${
            i < validRating ? "fill-[#2ED1B2] text-[#2ED1B2]" : "fill-slate-100 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
};

const FallbackAvatar = ({ name, className }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className={`rounded-full bg-gradient-to-br from-[#F8F9FB] to-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center text-[#0EA5A4] font-bold shadow-sm ${className}`}>
      {initial}
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function TestimonialsSection({ testimonials = fallbackTestimonials }) {
  // 🟢 1. Global Background Parallax
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.08);

  const data = testimonials?.length > 0 ? testimonials : fallbackTestimonials;
  
  // Separate featured from regular
  const featured = data.find((t) => t.isFeatured) || data[0];
  const regular = data.filter((t) => t._id !== featured?._id);

  return (
    <section className="relative w-full bg-[#F8F9FB] py-6 md:py-14 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      {/* Subtle Background Breathing Glow */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#2ED1B2]/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-white px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Client Feedback
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.05] mb-6"
          >
            Trusted by Brands That Want{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Real Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            Real results from businesses that chose systems over guesswork.
          </motion.p>
        </motion.div>

        {/* ================= TESTIMONIALS LAYOUT ================= */}
        <div className="flex flex-col gap-8">
          {/* 🟢 Featured Testimonial (Large Premium Card) */}
          {featured && <FeaturedCard testimonial={featured} />}

          {/* 🟢 Regular Testimonials Grid */}
          {regular.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">
              {regular.map((testimonial, index) => (
                <RegularCard key={testimonial._id} testimonial={testimonial} index={index} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Featured Premium Card
// ----------------------------------------------------------------------
function FeaturedCard({ testimonial }) {
  const cardRef = useRef(null);

  // Localized Scroll Lift
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["0 1.1", "1 0.8"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [60, 0]), { stiffness: 80, damping: 25 });
  const opacity = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 25 });

  return (
    <motion.div ref={cardRef} style={{ y, opacity }} className="w-full">
      <div className="relative group bg-white rounded-[2.5rem] p-8 md:p-14 lg:p-16 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(46,209,178,0.15)] overflow-hidden">
        
        {/* Decorative Quote mark & Glow */}
        <Quote className="absolute -top-8 -left-8 md:top-8 md:left-8 text-[#F8F9FB] w-48 h-48 -z-0 rotate-180 transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start text-center lg:text-left">
          
          <div className="flex-1">
            {renderStars(testimonial.rating)}
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0F172A] leading-snug tracking-tight mb-8">
              "{testimonial.feedback}"
            </blockquote>
            
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="shrink-0 w-16 h-16 relative rounded-full overflow-hidden shadow-sm border border-[#E5E7EB]">
                {testimonial.imageUrl ? (
                  <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                ) : (
                  <FallbackAvatar name={testimonial.name} className="w-full h-full text-xl" />
                )}
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#0F172A]">{testimonial.name}</h4>
                <p className="text-sm font-semibold text-[#475569]">
                  {testimonial.role} <span className="text-[#2ED1B2] mx-1">•</span> {testimonial.company}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 🟢 Regular Testimonial Card Grid Item
// ----------------------------------------------------------------------
function RegularCard({ testimonial, index }) {
  const cardRef = useRef(null);

  // Asymmetric Parallax Stagger
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["0 1.15", "1 0.9"] });
  const startY = index === 1 ? 60 : index === 0 ? 40 : 80; // Middle card comes up faster
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [startY, 0]), { stiffness: 90, damping: 25 });
  const opacity = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 90, damping: 25 });

  return (
    <motion.div ref={cardRef} style={{ y, opacity }} className="h-full">
      <motion.div 
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative h-full bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm transition-all duration-300 ease-out hover:border-[#2ED1B2]/30 hover:shadow-[0_20px_40px_-10px_rgba(46,209,178,0.12)] flex flex-col group overflow-hidden"
      >
        <Quote className="absolute top-6 right-6 text-[#F8F9FB] w-16 h-16 rotate-180 transition-transform duration-500 group-hover:scale-110" />

        <div className="relative z-10 flex-1 flex flex-col">
          {renderStars(testimonial.rating)}
          
          <blockquote className="text-[#475569] text-lg font-medium leading-relaxed mb-8 flex-1">
            "{testimonial.feedback}"
          </blockquote>
          
          <div className="flex items-center gap-4 pt-6 border-t border-[#E5E7EB]/50">
            <div className="shrink-0 w-12 h-12 relative rounded-full overflow-hidden border border-[#E5E7EB]">
              {testimonial.imageUrl ? (
                <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
              ) : (
                <FallbackAvatar name={testimonial.name} className="w-full h-full text-base" />
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0F172A]">{testimonial.name}</h4>
              <p className="text-xs font-semibold text-[#475569] mt-0.5">
                {testimonial.role} <span className="text-[#2ED1B2] mx-1">•</span> {testimonial.company}
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}